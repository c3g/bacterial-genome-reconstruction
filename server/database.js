/*
 * database.js
 */

const SqliteDatabase = require('./helpers/sqlite-database')
const config = require('./config')

/*
 * Setup SQL connection
 */

const client = new SqliteDatabase(config.paths.database)

// const NOW = `to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')::timestamp`

module.exports = client

