'use strict'

const d3 = window.d3
const addLabel = require('./add-label')

function sumAllocs(d) {
  function add(acc, alloc) {
    return acc + (alloc.count * alloc.size)
  }
  return d.allocations.reduce(add, 0)
}

function defaultGetChildren(d) {
  if (!d.children || !d.children.length) return []
  if (typeof d.children.filter !== 'function') return []
  return d.children.filter(x => !!x && !!x.allocations)
}

module.exports = function initFlamegraph({
      graph
    , clazz
    , width = 1400
    , height = 800
    , getChildren = defaultGetChildren
}) {
  const labelMargin = 40

  const svg = d3.select(clazz).append('svg')
    .attr('width', width)
    .attr('height', height + labelMargin)

  function getSize(d) {
    return Math.max(sumAllocs(d), 2.5)
  }

  const partition = d3.layout.partition()
    .size([ width, height ])
    .children(getChildren)
    .value(getSize)

  const color = d3.scale.category20()
  const nodes = partition.nodes(graph)

  const g = svg.selectAll('.node')
      .data(nodes)
      .enter()
        .append('g')

  const el = g.append('rect')
    .attr('class', 'node')
    .attr('x', d => d.x)
    .attr('y', d => height - d.y - d.dy)
    .attr('width', d => d.dx)
    .attr('height', d => d.dy)
    .style('fill', d => color((getChildren(d) ? d : d.parent).name))

  addLabel({ d3, g, el, nodes, sumAllocs, id: 'tip-flamegraph', x: 0, y: height + labelMargin / 2 })
}
