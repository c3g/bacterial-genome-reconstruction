/*
 * backup.js
 */

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const BACKUP_SCRIPT = path.join(__dirname, '../daily-backup')

let interval = undefined

function start() {
  const exists = fs.existsSync(BACKUP_SCRIPT)

  console.log('Starting backups: ', exists)

  if (!exists)
    return

  interval = setInterval(backup, 1000 * 60 * 60 * 24)
  backup()
}

function stop() {
  if (!interval)
    return
  interval = clearInterval(interval)
}

function backup() {
  exec(BACKUP_SCRIPT, (err, stdout, stderr) => {
    if (err)
      return console.error(err)
    if (stderr)
      return console.error(stderr)
    console.log(stdout)
  })
}

module.exports = { start, stop }
