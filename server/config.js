/*
 * config.js
 */

const path = require('path')

module.exports = {
  paths: {
    data:       path.join(__dirname, 'data'),
    tmp:        path.join(__dirname, 'data', 'tmp'),
    requestsDB: path.join(__dirname, 'data', 'requests.db'),
    requests:   path.join(__dirname, 'data', 'requests'),
    database:   path.join(__dirname, 'data', 'db.sqlite'),
  },
}
