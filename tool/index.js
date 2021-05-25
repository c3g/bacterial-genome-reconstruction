/*
 * index.js
 */

const generateRandomReads = require('./generate-random-reads')
const identifyClosestSpecies = require('./identify-closest-species')
const identifyClosestReferences = require('./identify-closest-references')
const readLengthOptimization = require('./read-length-optimization')

module.exports = {
  generateRandomReads,
  identifyClosestSpecies,
  identifyClosestReferences,
  readLengthOptimization,
}
