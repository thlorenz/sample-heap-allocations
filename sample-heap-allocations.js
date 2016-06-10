'use strict'

const bindings = require('bindings')
const binding = bindings('sample_heap')

/**
 * Starts sampling of memory allocations
 *
 * @name startSampling
 * @function
 * @param {number} interval the sampling interval in ms, default: 32
 * @param {number} stack_depth depth of stack to include for each memory allocation, default: 6
 */
exports.startSampling = function startSampling(interval = 32, stack_depth = 6) {
  // todo: ensure these are integers
  binding.startSampling(interval, stack_depth)
}

/**
 * Stops sampling of memory allocations
 *
 * @name stopSampling
 * @function
 */
exports.stopSampling = function stopSampling() {
  binding.stopSampling()
}

/**
 * Visits all nodes and returns a flat array of them.
 * Each has an id and an array of ids of its children.
 * It has another array of allocations associated with that node.
 *
 * @name visitNodes
 * @function
 * @return Array.<Object> nodes found
 */
exports.visitNodes = function visitNodes() {
  const nodes = []
  let currentNode = null

  function onnode(id,
                  script_id,
                  script_name,
                  name,
                  line_number,
                  column_number) {
    currentNode = {
      id,
      script_id,
      script_name,
      name,
      line_number,
      column_number,
      allocations: [],
      child_ids: []
    }
    nodes.push(currentNode)
  }

  function onallocation(count, size) {
    currentNode.allocations.push({ count, size })
  }

  function onchild(child) {
    currentNode.child_ids.push(child)
  }

  binding.visitNodes(onnode, onallocation, onchild)
  return nodes
}

function processNode(hash, node) {
  function getChild(id) { return hash[id] }
  node.children = node.child_ids.map(getChild)

  function processChild(child) {
    processNode(hash, child)
  }
  node.children.forEach(processChild)
}

/**
 * Reconstructs the callgraph from the nodes array obtained via @see visitNodes.
 *
 * @name constructCallgraph
 * @function
 * @param {Array.<Object>} nodes obtained via @see visitNodes
 * @return {Object} the callgraph including all allocation information
 */
exports.constructCallgraph = function constructCallgraph(nodes) {
  function hashify(acc, node) {
    acc[node.id] = node
    return acc
  }
  const hash = nodes.reduce(hashify, {})

  const rootnode_id = '0:0:0'
  const rootnode = hash[rootnode_id]
  processNode(hash, rootnode)
  return rootnode
}

/**
 * Allows collecting all sampled allocations using the Visitor pattern, thus matching the underlying v8 API.
 *
 * @name visitAllocationProfile
 * @function
 * @param {function} cb called back with each callsite for which memory allocations where encountered
 */
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
      depth          : depth,
      name           : name,
      script         : script_name,
      script_id      : script_id,
      start_position : start_position,
      line_number    : line_number,
      column_number  : column_number,
      allocations    : []
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

/**
 * Higher level API which collects all allocated callsites via @see visitAllocationProfile.
 *
 * @name collectAllocations
 * @function
 * @return {Array.<Object>} array of collected callsites
 */
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
