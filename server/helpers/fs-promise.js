/*
 * fs.js
 */


const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const unlink = promisify(fs.unlink)
const rename = promisify(fs.rename)

function copyFile(source, target) {
  return new Promise((resolve, reject) => {
    const rd = fs.createReadStream(source)
    const wr = fs.createWriteStream(target)
    rd.on('error', reject)
    wr.on('error', reject)
    wr.on('close', resolve)
    rd.pipe(wr)
  })
}

module.exports = {
  readFile,
  writeFile,
  unlink,
  rename,
  copyFile,
}
