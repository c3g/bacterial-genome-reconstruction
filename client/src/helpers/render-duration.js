/*
 * render-duration.js
 */


const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR   = 60 * MINUTE
const DAY    = 24 * HOUR

export default function renderDuration(ms, recursive = false) {
  if (ms < SECOND)
    return recursive ? '' : '0s'

  if (ms < MINUTE)
    return `${Math.round(ms / SECOND)}s`

  if (ms < HOUR)
    return `${Math.round(ms / MINUTE)}m ${renderDuration(ms % MINUTE, true)}`.trim()

  if (ms < DAY)
    return `${Math.round(ms / HOUR)}h ${renderDuration(ms % HOUR, true)}`.trim()

  return `${Math.round(ms / DAY)}d ${renderDuration(ms % DAY, true)}`.trim()
}
