'use strict'

const runnel = require('runnel')
const fs = require('fs')

function formatAllocation(alloc) {
  return `${alloc.count} x ${alloc.size} `
}

function formatAllocations(allocs) {
  // ignore allocations that didn't happen (currently a bug in v8 I believe)
  return allocs
    .filter(x => !!x.count)
    .map(formatAllocation)
}

function attachSourceToCallsites(callsites, includeSourceLines, cb) {
  function attachSource(callsite) {
    function doAttach(onattached) {
      function onread(err, src) {
        if (err) return onattached(err)
        const lines = src.toString().split('\n')
        const lineno = callsite.line_number - 1 // make 'em zero based
        callsite.formatted.source = lines.slice(lineno, lineno + includeSourceLines)
        onattached()
      }
      fs.readFile(callsite.script, onread)
    }
    return doAttach
  }

  const tasks = callsites
    .filter(x => x.allocations && x.allocations.length)
    .map(x => attachSource(x))

  if (!tasks.length) return setImmediate(cb)
  runnel(tasks.concat(cb))
}

function addFormatToCallsites(callsites, includeSourceLines, cb) {
  // walk backward in order to present this in form of a stacktrace
  for (var i = callsites.length - 1; i >= 0; i--) {
    const callsite = callsites[i]
    const formatted = {
        location: `${callsite.script}:${callsite.line_number}:${callsite.column_number}`
      , allocations: formatAllocations(callsite.allocations)
    }
    callsite.formatted = formatted
  }
  if (includeSourceLines <= 0) return setImmediate(cb)
  attachSourceToCallsites(callsites, includeSourceLines, cb)
}

module.exports = function addFormat({ allocations, includeSourceLines = 5 }, cb) {
  let tasks = allocations.length
  let bail = false

  function onprocessed(err) {
    if (bail) return
    if (err) {
      bail = true
      return cb(err)
    }
    if (!--tasks) cb(null, allocations)
  }

  function processAllocation(alloc) {
    if (bail) return
    addFormatToCallsites(alloc.callsites, includeSourceLines, onprocessed)
  }

  allocations.forEach(processAllocation)
}
