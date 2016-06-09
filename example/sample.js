'use strict'

const sp = require('../')

module.exports = function sample(allocationFn, ondone) {
  sp.startSampling(32, 10)
  allocationFn()
 // const infos = sp.collectAllocations()
  const infos = sp.visitNodes()
  sp.stopSampling()

  ondone(infos)
}
