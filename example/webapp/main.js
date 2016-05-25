'use strict'

const xhr = require('xhr')
const controlPanelLinks = document.querySelectorAll('.control-panel a')
const messagesEl = document.getElementById('messages')
const samplesEl = document.getElementById('samples')

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
  function stringify(name, x) {
    let res =  name + ' ' + x.location + ' --- (' + x.allocations.join(' | ') + ')'
    if (x.source && x.source.length) res += '\n\n' + x.source.join('\n')
    return res
  }
  return { callsites: data.callsites.map(x => stringify(x.name, x.formatted)) }
}

function renderData(data) {
  /*global JsonHuman */
  const formatted = data.map(formattedOnly)
  const node = JsonHuman.format(formatted)
  samplesEl.appendChild(node)
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
