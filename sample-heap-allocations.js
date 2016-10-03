'use strict'

const bindings = require('bindings')
const binding = bindings('sample_heap')
const uniqueConcat = require('unique-concat')
const assert = require('assert')
const traverse = require('traverse')

function onnode(n) {
  if (this.circular) this.remove()
}

function scrubCircular(g) {
  return traverse(g).map(onnode)
}

/**
 * Starts sampling of memory allocations
 *
 * @name startSampling
 * @function
 * @param {number} interval the sampling interval in ms, default: 32
 * @param {number} stack_depth depth of stack to include for each memory allocation, default: 9999
 */
exports.startSampling = function startSampling(interval = 32, stack_depth = 9999) {
  assert.equal(typeof interval, 'number', 'First parameter "interval" needs to be a number')
  assert.equal(typeof stack_depth, 'number', 'Second parameter "stack_depth" needs to be a number')
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
 * Visits all nodes in the allocation callgraph and returns a flat array of them.
 * Each has an id and an array of ids of its children.
 * It has another array of allocations associated with that node.
 *
 * @name collectNodes
 * @function
 * @return Array.<Object> nodes found
 */
exports.collectNodes = function collectNodes() {
  const nodes = []
  let currentNode = null

  function onnode(id,
                  script_id,
                  script_name,
                  name,
                  line_number,
                  column_number,
                  start_position) {
    currentNode = {
      id,
      script_id,
      script_name,
      name,
      line_number,
      column_number,
      start_position,
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

function processNode(hash, node, seen) {
  if (~seen.indexOf(node.id)) return

  function getChild(id) { return hash[id] }
  const children = node.child_ids.map(getChild)
  node.children = children

  function processChild(child) {
    processNode(hash, child, seen.concat(node.id))
  }
  children.forEach(processChild)
}

/**
 * Reconstructs the callgraph from the nodes array obtained via @see collectNodes.
 *
 * @name constructCallgraph
 * @function
 * @param {Array.<Object>} nodes obtained via @see collectNodes
 * @return {Object} the callgraph including all allocation information
 */
exports.constructCallgraph = function constructCallgraph(nodes) {
  function hashify(acc, node) {
    const exists = acc[node.id]
    if (!exists) {
      acc[node.id] = node
    } else {
      // some functions may have allocated in different places or
      // or for other reasons appear multiple times in the nodes array

      // everything but allocations and children will be the same, so
      // let's concat the allocations and merge the child_ids
      exists.allocations = exists.allocations.concat(node.allocations)
      exists.child_ids = uniqueConcat(exists.child_ids, node.child_ids)
    }

    return acc
  }
  const hash = nodes.reduce(hashify, {})

  const rootnode_id = '0:0:0 (root)'
  const rootnode = hash[rootnode_id]
  processNode(hash, rootnode, [ ])
  return rootnode
}

/**
 * Higher level API which collects all nodes of the callgraph via @see collectNodes
 * and then reconstructs the callgraph via @see constructCallgraph.
 *
 * @name collectAllocations
 * @function
 * @param {Object=} opts
 * @param {Boolean=} opts.stopSampling stops sampling after collecting nodes, default: true
 * @return {Object} the callgraph including all allocation information
 */
exports.collectAllocations = function collectAllocations({ stopSampling = true, noCircular = true } = {}) {
  const nodes = exports.collectNodes()
  if (stopSampling) exports.stopSampling()

  const graph = exports.constructCallgraph(nodes)
  return noCircular ? scrubCircular(graph) : graph
}

exports.addFormat = require('./lib/add-format')

//
// diagnostic tools
//
/*
function write(obj, file) {
  const stringify = require('json-stringify-safe')
  require('fs').writeFileSync(file || './result.json', stringify(obj, null, 2))
  return obj
}
*/
