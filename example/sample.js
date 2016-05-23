'use strict'

const sp = require('../')

module.exports = function sample(allocationFn, ondone) {
  const infos = []
  function onNode(info) {
   infos.push(info)
  }

  sp.startSampling(32, 10)
  allocationFn()
  sp.visitAllocationProfile(onNode)
  sp.stopSampling()

  ondone(infos)
}
