/*
 * time-log.js
 */

const KeyValueStore = require('sqlite-objects').KeyValueStore
const weightedMean = require('weighted-mean')
const weightForTime = require('./weight-for-time')

const config = require('../config')


/**
 * Stores the time it took for a task to run
 * Only one task per requestId can exist at a time
 * @typedef {Object} TimeLog
 * @property {number} start - When the task was started
 * @property {number} duration - How long it ran
 */

/**
 * Log of run times, for time estimation
 * @type {KeyValueStore.<string, Array.<TimeLog>>}
 */
const timeLogsByName = new KeyValueStore(config.paths.timeLogsDB)


// Exports

module.exports = {
  add,
  estimate,
}

/**
 * @param {string} name
 * @param {TimeLog} log
 */
function add(name, log) {
  return timeLogsByName.get(name)
  .then(logs => logs || [])
  .then(logs => {
    logs.unshift(log)
    return logs.slice(0, 50)
  })
  .then(logs => timeLogsByName.set(name, logs))
}

/**
 * @param {string} name
 * @returns {number}
 */
function estimate(name) {
  return timeLogsByName.get(name)
  .then(logs => {
    if (!logs)
      return -1

    const values = logs.map(log => [
      log.duration,
      weightForTime(Date.now() - log.start)
    ])

    return weightedMean(values)
  })
}
