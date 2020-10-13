/*
 * api.js
 */

const stream = require('stream')
const express = require('express')
const router = express.Router()
const Zip = require('adm-zip')

const Request = require('../helpers/request')
const Task = require('../helpers/task')
const { apiRoute } = require('../helpers/handlers.js')
const {
  identifyClosestSpecies,
  identifyClosestReferences,
  readLengthOptimization,
} = require('../../bacterial-genome-reconstruction')


const taskRunnerByName = {
  'identify-closest-species': (request, params) =>
    identifyClosestSpecies(request.folder, request.subsampledPath.r1, request.inputPath.r1),
  'identify-closest-references': (request, params) =>
    identifyClosestReferences(request.folder, request.subsampledPath.r1, params.genus),
  'read-length-optimization': (request, params) =>
    readLengthOptimization(request.folder, request.subsampledPath.r1, params.genus, params.accession, 1)
    .then(r1 =>
      (request.subsampledPath.r2 ?
        readLengthOptimization(request.folder, request.subsampledPath.r2, params.genus, params.accession, 2) :
        Promise.resolve(null))
      .then(r2 => ({ data: { r1, r2 } }))
    )
}

const taskDownloadsByName = {
  'identify-closest-species': (request) => {
    const { summaryPath, readLengthPath } = request.results['identify-closest-species'].results
    return [summaryPath, readLengthPath]
  },
  'identify-closest-references': (request) => {
    const { summaryPath, readLengthPath } = request.results['identify-closest-references'].results
    return [summaryPath, readLengthPath]
  },
  'read-length-optimization': (request) => {
    const { r1, r2 } = request.results['read-length-optimization'].results.data
    return [r1 && r1.summaryPath, r2 && r2.summaryPath].filter(Boolean)
  },
}

/* POST create (queue) task */
router.use('/create/:id/:name', apiRoute(req => {
  const { id, name } = req.params

  return Request.get(id)
  .then(request => {
    const runner = () =>
      taskRunnerByName[name](request, req.body)

    const meta =
      name === 'read-length-optimization' && request.inputPath.r2 ?
        2 : 1

    return Task.create(id, name, runner, meta)
    .then(task => {

      task.didComplete
      .then(() => Task.serialize(task))
      .then(() => {
        Request.update(id, { results: { [name]: results } })
      })

      return Task.serialize(task)
    })
  })
}))

/* POST download task results */
router.use('/download/:id/:name', (req, res) => {
  const { id, name } = req.params

  Request.get(id).then(request => {
    const downloads = taskDownloadsByName[name](request)

    streamZippedFiles(
      downloads,
      `${name}.zip`,
      res
    )
  })
})

/* POST get task status */
router.use('/status/:id', apiRoute(req =>
  Task.get(req.params.id)
    .then(Task.serialize)
    .then(t => {
      if (t.status === Task.Status.COMPLETED)
        Task.destroy(req.params.id)
      return t
    })
))

/* POST destroy task */
router.use('/destroy/:id', apiRoute(req => {
  // Task destruction may take a while if it's running
  Task.destroy(req.params.id)
  return true
}))

module.exports = router

// Helpers

function streamZippedFiles(filepaths, name, res) {
  const zip = new Zip()
  filepaths.forEach(filepath => { zip.addLocalFile(filepath) })

  const zipStream = new stream.PassThrough()
  zipStream.end(zip.toBuffer())

  res.set('content-disposition', `attachment; filename=${name}`);
  res.set('content-type', 'application/zip');

  zipStream.pipe(res)
}
