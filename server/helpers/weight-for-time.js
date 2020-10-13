/*
 * weight-for-time.js
 */

module.exports = weightForTime

const HOUR = 60 * 60 * 1000
const DAY  = 24 * HOUR
const WEEK = 7 * DAY

// function:
//   y = 1 + 99 * (0.2) ^ (x / (1000 * 60 * 60 * 2))
//
// Starts at 100, decays to 1 quickly (after 12 hours it's very close)

function weightForTime(timestamp) {
  return 1 + 99 * Math.pow(0.2, (timestamp / (2 * HOUR)))
}
