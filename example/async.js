'use strict'

const allocate = require('./allocate')
const sp = require('../')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 2, true))
}

console.log('sync')
sp.startSampling()
allocate.flatArray()
printAllocs()

console.log('async')
sp.startSampling()
allocate.flatArray()
setImmediate(printAllocs)
function printAllocs() {
  const infos = sp.collectAllocations()
  inspect(infos)
}
