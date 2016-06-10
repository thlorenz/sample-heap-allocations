'use strict'

const Context = require('gl-context')
const Flamegraph = require('sample-heap-flamegraph').default
const graph = require('./graph')
console.log('graph', graph)

function render(a) {
  return `
    ${a.name}
    ${a.script_name}:${a.line_number}:${a.column_number}
  `
}

/*
function sumAllocs(alloc) {
  function sumup(acc, a) {
    return acc + (a.size * a.count)
  }
  const totalAllocs = alloc.allocations.reduce(sumup, 0)

  max = max > totalAllocs ? max : totalAllocs
}
*/

function getUIDs(node, uids) {
  uids.push(node.id)
  for (var i = 0; i < node.children.length; i++) {
    getUIDs(node.children[i], uids)
  }

  console.log(uids)
  return uids
}

const canvas = document.body.appendChild(document.createElement('canvas'))
const gl = Context(canvas, render)

const flamegraph = new Flamegraph(
    gl
  , graph
  , { getValue: d => 2
    , getRoot: () => graph
    , getChildren: d => d.children
    , getUID: d => d.id
    , getUIDs: () => getUIDs(graph, [])
    }
)

console.log(flamegraph)
