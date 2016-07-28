'use strict'

module.exports = function addLabel({
    d3
  , g
  , el
  , nodes
  , id
  , x
  , y
  , sumAllocs
  , getLabel = defaultGetLabel
}) {
  function defaultGetLabel(d) {
    return `[${sumAllocs(d)}] (${d.name}) ${d.script_name}`
  }

  g.selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('id', id)
    .attr('x', x)
    .attr('y', y)
    .attr('font-size', '11px')
    .style('opacity', 0)
    .style('white-space', 'pre')

  function mouseover(d) {
    d3.select(this)
      .transition()
      .duration(200)
      .ease('elastic')
      .style('opacity', 0.3)
      .style('cursor', 'pointer')

    d3.select('#' + id)
      .text(getLabel(d))
      .style('opacity', 0.9)
  }

  function mouseout(d) {
    d3.select(this)
      .transition()
      .duration(100)
      .style('opacity', 1)

    d3.select('#' + id).style('opacity', 0)
  }

  el.on('mouseover', mouseover)
    .on('mouseout', mouseout)
}
