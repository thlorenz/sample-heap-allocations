'use strict'

const d3 = window.d3
const addLabel = require('./add-label')

function sumAllocs(d) {
  function add(acc, alloc) {
    return acc + (alloc.count * alloc.size)
  }
  return d.allocations.reduce(add, 0)
}

module.exports = function initSunburst({
      graph
    , clazz
    , width = 1000
    , height = 800
    , getChildren = d => d.children
}) {
  const radius = Math.min(width, height) / 2

  const svg = d3.select(clazz).append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height * 0.52 + ')')

  function getSize(d) {
    return Math.max(sumAllocs(d), 2.5)
  }

  const partition = d3.layout.partition()
    .size([ 2 * Math.PI, radius * radius ])
    .children(getChildren)
    .value(getSize)

  const arc = d3.svg.arc()
    .startAngle(d => d.x)
    .endAngle(d => d.x + d.dx)
    .innerRadius(d => Math.sqrt(d.y))
    .outerRadius(d => Math.sqrt(d.y + d.dy))

  const color = d3.scale.category20c()
  const nodes = partition.nodes(graph)

  const g = svg.datum(graph).selectAll('g')
      .data(nodes)
      .enter()
        .append('g')

  const el = g.append('path')
    .attr('display', d => d.depth ? null : 'none') // hide inner ring
    .attr('d', arc)
    .style('stroke', '#fff')
    .style('fill', d => color((d.children ? d : d.parent).name))
    .style('fill-rule', 'evenodd')

  function getLabel(d) {
    const parts = d.script_name.split('/')
    const shortScriptName = parts.slice(-2).join('/')
    return `[${sumAllocs(d)}] (${d.name}) ${shortScriptName}`
  }

  addLabel({ d3, g, el, nodes, sumAllocs, getLabel, id: 'tip-sunburst', x: -100, y: 0 })
}
