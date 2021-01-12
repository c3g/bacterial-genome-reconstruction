/*
 * exec.js
 */

const cp = require('child_process')
const util = require('util')
const execPromise = util.promisify(cp.exec)

const execDev = command => {
  console.log('exec:', command)
  return execPromise(command)
  .then(res => {
    console.log('done:', command)
    return res
  })
  .catch(err => {
    console.log('fail:', command, err)
    return err
  })
}

if (process.env.NODE_ENV === 'development')
  module.exports = execDev
else
  module.exports = execPromise

