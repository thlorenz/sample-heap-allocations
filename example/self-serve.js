'use strict'

const PORT = process.env.PORT || 4000
const fs = require('fs')
const http = require('http')
const server = http.createServer()

const sh = require('../')
const allocate = require('./allocate')

function serveStartSampling(res) {
  sh.startSampling()
  const msg = 'Sampling Started'
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': msg.length })
  res.end(msg)
}

function serveStopSampling(res) {
  const allocs = sh.collectAllocations()

  const json = JSON.stringify(allocs, null, 2)
  res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': json.length })
  res.end(json)
}

function serveAllocateFlat(res) {
  allocate.flatArray()
  res.writeHead(200)
  res.end('allocated')
}

function serveAllocateNested(res) {
  allocate.innerOuterArray()
  res.writeHead(200)
  res.end('allocated')
}

// Starting sampling via one request, then allocating via another and then
// collecting data via a third does not seem to work.
// In that case we get an empty  allocation profile with only one root node, i.e.
// '(V8 API)' or 'JS' as the function name.
// Therefore we need to do this in one go at this point via the sample routes.
function serveSampleFlat(res) {
  sh.startSampling()
  allocate.flatArray()
  serveStopSampling(res)
}

function serveSampleNested(res) {
  sh.startSampling()
  allocate.innerOuterArray()
  serveStopSampling(res)
}

function onrequest(req, res) {
  console.error('%s %s', req.method, req.url)

  if (req.url === '/start_sampling') return serveStartSampling(res)
  if (req.url === '/stop_sampling') return serveStopSampling(res)
  if (req.url === '/allocate_flat') return serveAllocateFlat(res)
  if (req.url === '/allocate_nested') return serveAllocateNested(res)
  if (req.url === '/sample_flat') return serveSampleFlat(res)
  if (req.url === '/sample_nested') return serveSampleNested(res)

  // this server serves itself by default
  fs.createReadStream(__filename)
    .pipe(res)
}

server
  .on('listening', x => console.log('listening on', PORT))
  .on('request', onrequest)
  .listen(PORT)
