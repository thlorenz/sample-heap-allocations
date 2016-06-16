'use strict'

const sp = require('../')

module.exports = function sample(allocationFn, ondone) {
  sp.startSampling()
  allocationFn()
  // stops sampling automatically
  const infos = sp.collectAllocations()

  ondone(infos)
}
