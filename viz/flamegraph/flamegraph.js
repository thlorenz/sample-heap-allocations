'use strict'

const d3 = require('d3')

export default class AllocSampleFlamegraph {
  constructor({
      el
    , root
    , width = 960
    , height = 540
    , getValue
    , getChildren
  }) {
    this.el          = el
    this.root        = root
    this.width       = width
    this.height      = height
    this.getValue    = getValue     || (d => d)
    this.getChildren = getChildren  || (d => d.children)

    this.render()
  }

  render() {
    const color = d3.scale.category20c()

    this.svg = d3.select(this.el)
      .append('svg:svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'alloc-sample-flamegraph')

    const rect = this.svg.selectAll('rect')
    const x = d3.scale.linear()
      .range([0, this.width])

    const y = d3.scale.linear()
        .range([0, this.height])

    function getChildren(d) {
      return d.children
    }

    const partition = d3.layout.partition()
      .children(getChildren)

    //console.log(partition(this.root))

    function getWidth(d) {

    }

    rect
      .data(partition(this.root))
    .enter().append('rect')
      .attr('x', function(d) { return x(d.x) })
      .attr('y', function(d) { return y(d.y) })
      .attr('width', d => x(d.allocations.length))
      .attr('height', function(d) { return y(d.dy) })
      .attr('text', d => `${d.name} (${d.script_name}:${d.line_number}:${d.column_number})`)
      .attr('fill', function(d) { return color(d.script_id + d.line_number) })
  }

  /*
  renderNode(depth) {
    const scale_x = d3.scale.linear().range([0, this.width])
    const scale_y = d3.scale.linear().range([0, this.height])

    const nodes = this.partition(this.data)
    var g = d3.select(this.el).select('svg').selectAll('g').data(nodes)
    this.svg
      .selectAll('g')
      .data(this.data)

    const node =
      this.svg
      .enter()
      .append('svg:g')
      .attr('transform', d => `
        translate(
            ${scale_x(d.x)}
          , ${this.height - scale_y(depth)}
        )
      `)
    node.append('svg:rect')
      .attr('width', d => 100)
  }
  */
}
