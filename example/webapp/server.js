'use strict'

const PORT = 8000
const fs = require('fs')
const path = require('path')
const http = require('http')
const build = require('./build')

const sh = require('../../')
const allocate = require('../allocate')
const stringify = require('json-stringify-safe')

const server = http.createServer()

server
  .on('request', onRequest)
  .on('listening', onListening)
  .listen(PORT)

process.on('SIGTERM', onSIGTERM)

function onSIGTERM() {
  console.error('Caught SIGTERM, shutting down.')
  server.close()
  process.exit(0)
}

console.error('pid', process.pid)

function sendError(res, err) {
  res.end(JSON.stringify({ error: err.message }))
}

function serveIndex(res) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res)
}

function serveBundle(res) {
  res.writeHead(200, { 'Content-Type': 'application/javascript' })
  build().pipe(res)
}

function serveCss(res) {
  res.writeHead(200, { 'Content-Type': 'text/css' })
  fs.createReadStream(path.join(__dirname, 'index.css')).pipe(res)
}

function serveStartSampling(res) {
  sh.startSampling(32, 2)
  const json = JSON.stringify({ type: 'message', msg: 'Sampling Started' })
  res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': json.length })
  res.end(json)
}

function serveStopSampling(res) {
  // important to collect allocations before stopping to sample
  const allocs = sh.collectAllocations()

  // write(allocs)

  const json = stringify({ type: 'message', msg: 'Sampling Stopped', data: allocs })
  res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': json.length })
  res.end(json)
}

function serveAllocateFlat(res) {
  server.allocatedFlat = allocate.flatArray()
  const json = JSON.stringify({ type: 'message', msg: 'Flat Array Allocated' })
  res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': json.length })
  res.end(json)
}

function serveAllocateNested(res) {
  server.allocatedNested = allocate.innerOuterArray()
  const json = JSON.stringify({ type: 'message', msg: 'Nested Array Allocated' })
  res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': json.length })
  res.end(json)
}

// Handle Requests
function onRequest(req, res) {
  console.error('%s %s', req.method, req.url)

  if (req.url === '/') return serveIndex(res)
  if (req.url === '/bundle.js') return serveBundle(res)
  if (req.url === '/index.css') return serveCss(res)

  if (req.url === '/start_sampling') return serveStartSampling(res)
  if (req.url === '/allocate_flat') return serveAllocateFlat(res)
  if (req.url === '/allocate_nested') return serveAllocateNested(res)
  if (req.url === '/stop_sampling') return serveStopSampling(res)

  sendError(res, new Error('Page not found ' + req.url))
}

function onListening() {
  console.error('HTTP server listening on http://localhost:%d', this.address().port)
}

//
// diagnostic tools
//

/*
function write(obj, file) {
  require('fs').writeFileSync(file || './result.json', stringify(obj, null, 2))
  return obj
}
*/
