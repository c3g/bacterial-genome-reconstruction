/*
 * generate-random-reads.test.js
 */

const fs = require('fs')
const _ = require('rambda')
const generateRandomReads = require('./generate-random-reads')

const inputFile  = `${__dirname}/data/r1.fq`
const outputFile = `${__dirname}/data/subsampled.fasta`

const inputBuffer = fs.readFileSync(inputFile)

test('generateRandomReads()', () => {
  for (let n of _.range(0, 100)) {
    const reads = generateRandomReads(inputBuffer)
  }
})
