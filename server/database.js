/*
 * database.js
 */

const { Database } = require('sqlite-objects')
const config = require('./config')

/*
 * Setup SQL connection
 */

const client = new Database(config.paths.database)

// const NOW = `to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')::timestamp`

module.exports = client

