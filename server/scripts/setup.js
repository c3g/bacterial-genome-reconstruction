/*
 * setup.js
 */

const _ = require('shelljs')

const config = require('../config')


// Create require directories

_.mkdir('-p', [
  config.paths.data,
  config.paths.tmp,
  config.paths.requests,
])
