/*
 * generate-random-reads.js
 */

const fs = require('fs').promises

module.exports = generateRandomReads

if (require.main === module) {
  const inputFile = process.argv[2]
  const outputFile = process.argv[3]

  generateRandomReads(inputFile, outputFile)
}


async function generateRandomReads(inputFile, outputFile) {
  const content = (await fs.readFile(inputFile)).toString()
  const format = getFormat(content, inputFile)
  const blockLength = format === 'fastq' ? 4 : 2
  const lines = content.trim().split('\n')
  const groups = groupBy(lines, blockLength)

  const reads =
    Array.from({ length: 1000 }, (_, i) => {
      const index = random(0, groups.length)
      const lines = groups[index]
      return [`>${i + 1} (from line ${index * 4})`, lines[1]].join('\n')
    })
    .join('\n')

  await fs.writeFile(outputFile, reads)

  return outputFile
}

function groupBy(lines, n) {
  const result = []

  let current = []
  for (let i = 0; i < lines.length; i++) {
    current.push(lines[i])
    if (current.length === n) {
      result.push(current)
      current = []
    }
  }
  if (current.length === n) {
    result.push(current)
  }
  return result
}

function random(min, max) {
  return min + Math.round(Math.random() * (max - min))
}

function getFormat(content, filename) {
  if (content.charAt(0) === '@')
    return 'fastq'
  if (content.charAt(0) === '>')
    return 'fasta'
  throw new Error(`Couldn't recognize input format for file "${filename}"`)
}
