'use strict'

import Flamegraph from './'
const el = document.getElementById('flamegraph')
const root = require('./sample-graph')
const flamegraph = new Flamegraph({ el, root })

