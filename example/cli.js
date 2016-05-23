'use strict'

const allocate = require('./allocate')
const sample = require('./sample')

function inspect(obj, depth) {
  if (typeof console.error === 'function') {
    console.error(require('util').inspect(obj, false, depth || 15, true))
  }
}

sample(function alloc() {
  allocate.innerOuterArray()
  allocate.flatArray()
}, inspect)

