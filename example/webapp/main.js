'use strict'

const xhr = require('xhr')
const controlPanelLinks = document.querySelectorAll('.control-panel a')
const messagesEl = document.getElementById('messages')

const initFlamegraph = require('./viz/flamegraph')
const initSunburst = require('./viz/sunburst')
const initTree = require('./viz/tree')
const initTreemap = require('./viz/treemap')

const flamegraphEl = document.getElementById('flamegraph')
const sunburstEl = document.getElementById('sunburst')
const treeEl = document.getElementById('tree')
const treemapEl = document.getElementById('treemap')

function log(msg) {
   const html = '<span class="message">' + msg + '</span>'
   messagesEl.innerHTML = html
}

function logResponse(res) {
  var html = '<span><em>' + res.status + '</em></span>&nbsp;'
  if (res.error) {
    html += '<span class="error">' + res.error + '</span>'
  } else {
    html += '<span class="message">' + res.msg + '</span>'
  }
  messagesEl.innerHTML = html
}

function onresponse(err, res) {
  if (err) {
    console.error(err)
    return logResponse({ error: err, status: 500 })
  }
  log('Got response, parsing ...')
  const data = JSON.parse(res.body)
  data.status = res.statusCode
  if (data.type === 'message') logResponse(data)
  if (data.data) refresh(data.data)
}

function processRequest(href) {
  xhr({ uri: href }, onresponse)
}

function refresh(graph) {
  sunburstEl.innerHTML = ''
  flamegraphEl.innerHTML = ''
  treeEl.innerHTML = ''
  treemapEl.innerHTML = ''

  log('Updating visualizations ...')
  setTimeout(x => {
    initFlamegraph({ graph, clazz: '.flamegraph' })
    initSunburst({ graph, clazz: '.sunburst' })
    initTree({ graph, clazz: '.tree' })
    initTreemap({ graph, clazz: '.treemap' })
    log('Visualizations updated.')
  }, 200)
}

function hookLink(a) {
  console.log('hooking', a)
  function onclick(e) {
    e.preventDefault()
    processRequest(a.getAttribute('href'))
    return false
  }
  a.onclick = onclick
}

for (var i = 0; i < controlPanelLinks.length; i++) {
  hookLink(controlPanelLinks[i])
}
