'use strict'

const bindings = require('bindings')
const binding = bindings('sample_heap')

exports.startSampling = function startSampling(interval = 32, stack_depth = 6) {
  // todo: ensure these are integers
  binding.startSampling(interval, stack_depth)
}

exports.stopSampling = function stopSampling() {
  binding.stopSampling()
}

const visitAllocationProfile = exports.visitAllocationProfile = function visitAllocationProfile(cb) {
  const samples = []
  let sample = null
  let currentCallSite
  function onCall(depth,
                  name,
                  script_name,
                  script_id,
                  start_position,
                  line_number,
                  column_number) {
    // back at the top of the stack means we're dealing with a new sample
    if (depth === 1 && sample) {
      // push the previously collected sample and start over
      samples.push(sample)
      sample = { callsites: [] }
    }
    currentCallSite = {
      depth: depth,
      name: name,
      script: script_name,
      script_id: script_id,
      start_position: start_position,
      line_number: line_number,
      column_number: column_number,
      allocations: []
    }

    if (!sample) sample = { callsites: [] }
    sample.callsites.push(currentCallSite)
  }

  function onAlloc(size, count) {
    const allocation = { size: size, count: count }
    currentCallSite.allocations.push(allocation)
  }

  binding.allocationProfile(onAlloc, onCall)

  cb(samples)
}

exports.collectAllocations = function collectAllocations() {
  const infos = []
  function add(info) {
    infos.push(info)
  }

  function onNode(allocs) {
    function actualAllocs(alloc) {
      // some results we get have no allocations at all, so we ignore those
      const sitesLen = alloc.callsites.length
      for (var i = 0; i < sitesLen; i++) {
        const callsiteAllocs = alloc.callsites[i].allocations
        if (callsiteAllocs.length) return true
      }
      return false
    }
    allocs.filter(actualAllocs).forEach(add)
  }

  visitAllocationProfile(onNode)
  return infos
}

exports.addFormat = require('./lib/add-format')
