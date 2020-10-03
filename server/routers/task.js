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

    return Task.create(id, name, runner)
    .then(task => {

      task.didComplete.then(() => {
        request.results[name] = task.results || task.error
      })

      return Task.serialize(task)
    })
  })
}))

/* POST get task status */
router.use('/status/:id', apiRoute(req =>
  Task.get(req.params.id).then(Task.serialize)
))

/* POST destroy task */
router.use('/destroy/:id', apiRoute(req => {
  // Task destruction may take a while if it's running
  Task.destroy(req.params.id)
  return true
}))

module.exports = router
