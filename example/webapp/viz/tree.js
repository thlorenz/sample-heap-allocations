'use strict'

const d3 = window.d3
const addLabel = require('./add-label')

module.exports = function initTree({
      graph
    , clazz
    , width = 1400
    , height = 1600
    , getChildren = d => d.children
}) {
  const scale = 30
  let maxAllocs = 0

  function sumAllocs(d) {
    function add(acc, alloc) {
      return acc + (alloc.count * alloc.size)
    }
    d.data.allocSum  = d.data.allocations.reduce(add, 0)
    maxAllocs = Math.max(maxAllocs, d.data.allocSum)
  }

  const root = d3.hierarchy(graph, getChildren)
  root.each(sumAllocs)

  const tree = d3.tree()
      .size([ height, width - 150 ])
  tree(root)

  const svg = d3.select('.tree').append('svg')
      .attr('width', width)
      .attr('height', height)
    .append('g')
      .attr('transform', 'translate(40,0)')

  const nodes = root.descendants()

  // link paths
  svg.selectAll('.link')
        .data(nodes.slice(1))
      .enter().append('path')
        .attr('class', 'link')
        .attr('d', function(d) {
          return 'M' + d.y + ',' + d.x
              + 'C' + (d.y + d.parent.y) / 2 + ',' + d.x
              + ' ' + (d.y + d.parent.y) / 2 + ',' + d.parent.x
              + ' ' + d.parent.y + ',' + d.parent.x
        })
        .style({ fill: 'none', stroke: '#555', 'stroke-opacity': 0.4, 'stroke-width': 1.5 })

  const g = svg.selectAll('.node')
      .data(nodes)
      .enter()
        .append('g')

  g.attr('class', function(d) { return 'node' + (getChildren(d) ? ' node--internal' : ' node--leaf') })
    .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')' })

  function getRadius(d) {
    const r = Math.max(d.data.allocSum / maxAllocs * scale, 5)
    return Math.min(r, 120)
  }

  const el = g.append('circle')
    .attr('r', getRadius)

  g.append('text')
    .attr('dy', -15)
    .attr('x', d => getChildren(d) ? -8 : 8)
    .style('text-anchor', d => getChildren(d) ? 'end' : 'start')
    .text(d => d.data.name)

  function getLabel(d) {
    return `[${d.data.allocSum}] (${d.data.name}) ${d.data.script_name}`
  }

  addLabel({ d3, g, el, nodes, sumAllocs, getLabel, id: 'tip-tree', x: 0, y: -(height / 2) })

  // styling
  svg.selectAll('.node circle')
    .style({ fill: '#999' })
  svg.selectAll('.node text')
    .style({ 'font-size': 10, 'font-family': 'sans-serif' })
  svg.selectAll('.node--internal circle')
    .style({ fill: '#555' })
}
