/*
 * generate-random-reads.js
 */

export default function generateRandomReads(content) {
  const lines = content.trim().split('\n')
  const groups = groupBy(lines, 4)

  const reads =
    Array.from({ length: 1000 }, (_, i) => {
      const index = random(0, groups.length)
      const lines = groups[index]
      return [`>${i + 1} (from line ${index * 4})`, lines[1]].join('\n')
    })
    .join('\n')

  return reads
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
