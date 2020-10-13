/*
 * config.js
 */

const path = require('path')

const HOUR = 60 * 60 * 1000
const DAY  = 24 * HOUR

module.exports = {

  requests: {
    keepFor: 2 * DAY,
    cleanupInterval: 1 * DAY,
  },

  paths: {
    data:       path.join(__dirname, 'data'),
    tmp:        path.join(__dirname, 'data', 'tmp'),
    timeLogsDB: path.join(__dirname, 'data', 'timeLogs.db'),
    requestsDB: path.join(__dirname, 'data', 'requests.db'),
    requests:   path.join(__dirname, 'data', 'requests'),
    database:   path.join(__dirname, 'data', 'db.sqlite'),
  },
}
