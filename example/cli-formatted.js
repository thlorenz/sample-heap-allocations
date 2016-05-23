'use strict'

const allocate = require('./allocate')
const sample = require('./sample')
const addFormat = require('../').addFormat

function inspect(obj, depth) {
  if (typeof console.error === 'function') {
    console.error(require('util').inspect(obj, false, depth || 15, true))
  }
}

function onallocations(allocations) {
  function onformatted(err) {
    if (err) return console.error(err)
    inspect(allocations)
  }
  addFormat({ allocations, includeSourceLines: 10 }, onformatted)
}

sample(function alloc() {
  allocate.innerOuterArray()
  allocate.flatArray()
}, onallocations)
