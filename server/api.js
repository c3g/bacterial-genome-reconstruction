/*
 * api.js
 */

// const tmp = require('tmp-promise')
// const uuid = require('uuid').v4
// const parseCSV = require('csv-parse/lib/sync')
const express = require('express')
const router = express.Router()

const Requests = require('./helpers/requests')
const { dataHandler, errorHandler } = require('./helpers/handlers.js')
const {
  identifyClosestSpecies,
  identifyClosestReferences,
} = require('../bacterial-genome-reconstruction')

/* POST identify species */
router.use('/identify-closest-species', (req, res, next) => {
  req.setTimeout(20 * 60 * 1000)

  /* setTimeout(() => {
   *   const path = '/home/romgrk/github/bacterial-genome-reconstruction/bacterial-genome-reconstruction/output/module_1/summary.csv'
   *   const content = require('fs').readFileSync(path).toString()
   *   const results = parseCSV(content, { columns: true, skip_empty_lines: true })
   *   dataHandler(res)({ id: uuid(), results })
   * }, 10)
   * return */

  Requests.create(req.files.file.path)
  .then(request =>
    identifyClosestSpecies(request.folder, request.inputPath)
    .then(species => {
      request.species = species
      return request
    })
  )
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST identify references */
router.use('/identify-closest-references', (req, res, next) => {
  req.setTimeout(20 * 60 * 1000)

  const { id, genus } = req.body

  Requests.get(id)
  .then(request =>
    identifyClosestReferences(request.folder, genus)
    .then(references => {
      request.references = references
      return { references }
    })
  )
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
