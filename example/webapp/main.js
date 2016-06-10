'use strict'

// TODO: do with d3 and dagre-d3 (see in ../../tmp folder)
const allocations = window.allocations
const cytoscape = window.cytoscape

function render(a) {
  return `
    ${a.name}
    ${a.script_name}:${a.line_number}:${a.column_number}
  `
}

const nodes = []
const edges = []
let alloc
const pushedEdges = {}

let max = 0
var i
function sumAllocs(alloc) {
  function sumup(acc, a) {
    return acc + (a.size * a.count)
  }
  const totalAllocs = alloc.allocations.reduce(sumup, 0)

  max = max > totalAllocs ? max : totalAllocs
}

// size the nodes
for (i = 0; i < allocations.length; i++) {
  alloc = allocations[i]
  alloc.allocsSum = sumAllocs(alloc)
}
const biggestSize = 200
for (i = 0; i < allocations.length; i++) {
  alloc = allocations[i]
  const size = alloc.allocsSum / max * biggestSize
  alloc.style = { width: size, height: size }
}

for (i = 0; i < allocations.length; i++) {
  alloc = allocations[i]
  // ignore root for now ... renders oddly otherwise
  if (alloc.id === '0:0:0') continue
  alloc.rendered = render(alloc)
  nodes.push({ data: alloc })
  for (var j = 0; j < alloc.child_ids.length; j++) {
    const edgeId = alloc.id + ':' + alloc.child_ids[j]
    if (pushedEdges[edgeId]) continue
    edges.push({ data: { source: alloc.id, target: alloc.child_ids[j] } })
    pushedEdges[edgeId] = true
  }
}

cytoscape({
  container: document.getElementById('cy'),

  boxSelectionEnabled: false,
  autounselectify: true,
  layout: {
    name: 'dagre'
  },
  style: [
    {
      selector: 'node',
      style: {
        'content': 'data(rendered)',
        'text-opacity': 0.5,
        'text-valign': 'center',
        'text-halign': 'right',
        'background-color': '#11479e'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 4,
        'target-arrow-shape': 'triangle',
        'line-color': '#9dbaea',
        'target-arrow-color': '#9dbaea',
        'curve-style': 'bezier'
      }
    }
  ],
  elements: {
    nodes: nodes,
    edges: edges
  }
})
