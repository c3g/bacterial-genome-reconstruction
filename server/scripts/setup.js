/*
 * setup.js
 */

const _ = require('shelljs')
const path = require('path')


// Create require directories

const dataPath = path.normalize(`${__dirname}/../data`)
const tmpPath = `${dataPath}/tmp`
const requestsPath = `${dataPath}/requests`

_.mkdir('-p', [dataPath, tmpPath, requestsPath])
