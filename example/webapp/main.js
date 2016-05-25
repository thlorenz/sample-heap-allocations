'use strict'

const xhr = require('xhr')
const hjs = require('highlight.js')
window.hjs = hjs
const controlPanelLinks = document.querySelectorAll('.control-panel a')
const messagesEl = document.getElementById('messages')
const samplesEl = document.getElementById('samples')

const callsiteTmpl = require('./callsite.hbs')

function logResponse(res) {
  var html = '<span><em>' + res.status + '</em></span>&nbsp;'
  if (res.error) {
    html += '<span class="error">' + res.error + '</span>'
  } else {
    html += '<span class="message">' + res.msg + '</spanp>'
  }
  messagesEl.innerHTML = html
}

function formattedOnly(data) {
  function withAllocations(x) {
    return x.allocations && x.allocations.length
  }

  function stringify(name, x) {
    let res = { summary: name + ' ' + x.location + ' --- (' + x.allocations.join(' | ') + ')' }
    if (x.source && x.source.length) { 
      res.source = hjs.highlight('js', x.source.join('\n')).value
      console.log(res.source)
    }
    return res
  }
  return {
    callsites: data.callsites
      .filter(withAllocations)
      .map(x => stringify(x.name, x.formatted))
  }
}

function renderData(data) {
  const formatted = data.map(formattedOnly)
  let fullHtml = ''
  for (var i = 0; i < formatted.length; i++) {
    const html = callsiteTmpl(formatted[i].callsites)
    fullHtml += '<section class="callsites">' + html + '</section>'
  }
  samplesEl.innerHTML = fullHtml
}

function onresponse(err, res) {
  if (err) {
    console.error(err)
    return logResponse({ error: err, status: 500 })
  }
  var data = JSON.parse(res.body)
  data.status = res.statusCode
  if (data.data) renderData(data.data)
  if (data.type === 'message') return logResponse(data)
}

function processRequest(href) {
  xhr({ uri: href }, onresponse)
}

function hookLink(a) {
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
