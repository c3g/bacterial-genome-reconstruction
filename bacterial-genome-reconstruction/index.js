/*
 * index.js
 */

const identifyClosestSpecies = require('./identify-closest-species')
const identifyClosestReferences = require('./identify-closest-references')
const readLengthOptimization = require('./read-length-optimization')

module.exports = {
  identifyClosestSpecies,
  identifyClosestReferences,
  readLengthOptimization,
}
