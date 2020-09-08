/*
 * api.js
 */

const tmp = require('tmp-promise')
const express = require('express')
const router = express.Router()

const { dataHandler, errorHandler } = require('./helpers/handlers.js')
const {
  identifyClosestSpecies,
  identifyClosestReferences,
} = require('../bacterial-genome-reconstruction')

/* POST identify species */
router.use('/identify-closest-species', (req, res, next) => {
  tmp.dir()
  .then(outputFolder => identifyClosestSpecies(req.files.file.path, outputFolder))
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST identify references */
router.use('/identify-closest-references', (req, res, next) => {
  identifyClosestReferences(req.files.file.path)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* 404 handler */
router.use('/api', (req, res) => {
  res.status(404)
  res.json({ ok: false, message: '404', url: req.originalUrl })
  res.end()
})

module.exports = router
