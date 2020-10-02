/*
 * api.js
 */

const express = require('express')
const router = express.Router()

const Request = require('../helpers/request')
const Task = require('../helpers/task')
const { apiRoute } = require('../helpers/handlers.js')
const {
  identifyClosestSpecies,
  identifyClosestReferences,
  readLengthOptimization,
} = require('../../bacterial-genome-reconstruction')


const tasksByName = {
  'identify-closest-species': (request, params) =>
    identifyClosestSpecies(request.folder, request.inputPath),
  'identify-closest-references': (request, params) =>
    identifyClosestReferences(request.folder, params.genus),
  'read-length-optimization': (request, params) =>
    readLengthOptimization(request.folder, params.genus, params.accession),
};

/* POST create (queue) task */
router.use('/create/:id/:name', apiRoute(req => {
  const { id, name } = req.params

  return Request.get(id)
  .then(request => {
    const runner = () =>
      tasksByName[name](request, req.body)

    const task = Task.create(id, name, runner)
    task.didComplete.then(() => {
      request.results[name] = task.results || task.error
    })
  })
}))

/* POST get task status */
router.use('/status/:id/*', apiRoute(req =>
  Task.get(id)
  .then(t => ({
    name: t.name,
    order: t.order,
    status: t.status,
    results: t.results,
    error: t.error,
  }))
))

/* POST destroy task */
router.use('/destroy/:id/*', apiRoute(req => {
  // Task destruction may take a while if it's running
  Task.destroy(id)
  return true
}))

module.exports = router
