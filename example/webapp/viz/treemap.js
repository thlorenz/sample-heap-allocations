'use strict'

const d3 = window.d3
const addLabel = require('./add-label')

function sumAllocs(d) {
  function add(acc, alloc) {
    return acc + (alloc.count * alloc.size)
  }
  return d.allocations.reduce(add, 0)
}

module.exports = function initTreemap({
      graph
    , clazz
    , width = 1400
    , height = 800
    , getChildren = d => d.children
}) {
  const labelMargin = 40

  const root = d3.hierarchy(graph, getChildren)

  var treemap = d3.treemap()
      .size([width, height])
      .round(true)
      .padding(2)

  function sumRoot(d) {
    function add(acc, alloc) {
      return acc + (alloc.count * alloc.size)
    }
    return d.allocations.reduce(add, 0)
  }

  const nodes = treemap(root
      .sum(sumRoot)
      .sort((a, b) => b.height - a.height || b.depth - a.depth)
    )
    .descendants()

  const color = d3.scale.category20()

  const svg = d3.select(clazz).append('svg')
      .attr('width', width)
      .attr('height', height + labelMargin)
  const g = svg.selectAll('.node')
      .data(nodes)
      .enter()
        .append('g')

  const el = g.append('rect')
    .attr('class', 'node')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .style('fill', d => color(d.data.script_name))

  function getLabel(d) {
    return `[${sumAllocs(d.data)}] (${d.data.name}) ${d.data.script_name}`
  }

  addLabel({ d3, g, el, nodes, sumAllocs, getLabel, id: 'tip-treemap', x: 0, y: height + labelMargin / 2 })
}
