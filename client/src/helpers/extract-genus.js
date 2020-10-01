/*
 * extract-genus.js
 */


export default function extractGenus(name) {
  const results = name.match(/^\[([^\]]+)]|^'([^']+)'|(^\S+)/)
  if (!results)
    throw new Error('Couldn\'t extract genus from name: ' + name)

  const genus = (results[1] || results[2] || results[3]).toLowerCase()

  return genus
}
