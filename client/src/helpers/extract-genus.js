/*
 * extract-genus.js
 */


const genusPattern = /^\[([^\]]+)]|^'([^']+)'|(^\S+)/
const completePattern = /\s*,?\s*complete (sequence|genome)\s*$/

export default function extractGenus(name) {
  const results = name.match(genusPattern)

  if (!results)
    throw new Error('Couldn\'t extract genus from name: ' + name)

  const genus = (results[1] || results[2] || results[3]).toLowerCase()

  return genus
}

export function matchSpeciesName(name) {
  const results = name.match(genusPattern)

  if (!results)
    throw new Error('Couldn\'t extract genus from name: ' + name)

  const genus = (results[1] || results[2] || results[3])

  const notGenus = name.replace(genus, '')
  const complete = notGenus.match(completePattern)?.[0]
  const species = complete ? notGenus.replace(complete, '') : notGenus

  return {
    genus,
    species,
    complete,
  }
}
