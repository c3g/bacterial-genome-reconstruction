/*
 * exec.js
 */

const cp = require('child_process')
const util = require('util')
const chalk = require('chalk')
const execPromise = util.promisify(cp.exec)

const execDev = command => {
  console.log(chalk.blue.bold('exec:'), command)
  return execPromise(command)
  .catch(err => {
    console.log(chalk.red.bold('fail:'), command, err)
    return Promise.reject(err)
  })
}

if (process.env.NODE_ENV === 'development')
  module.exports = execDev
else
  module.exports = execPromise

