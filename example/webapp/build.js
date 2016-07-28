'use strict'
var browserify = require('browserify')

module.exports = function build() {
  return browserify({ debug: true })
    .require(require.resolve('./main'), { entry: true })
    .bundle()
}
