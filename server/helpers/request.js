/*
 * storage.js
 */

const fs = require('fs').promises
const del = require('del')
const cuid = require('cuid')
const { KeyValueStore } = require('sqlite-objects')
const { generateRandomReads } = require('../../bacterial-genome-reconstruction')

const Task = require('./task')
const { rejectWith } = require('./promise')
const config = require('../config')


module.exports = {
  create,
  get,
  update,
  destroy,
}

/**
 * Represents a user request
 * @typedef {Object} Request
 * @property {string} id - Unique identifier
 * @property {string} folder - Storage folder
 * @property {string} inputPath - Path of the input file (in storage folder)
 * @property {Object.<string, any>} results - Results of tasks
 */

/** @type {KeyValueStore.<string, Request>} */
const requestsById = new KeyValueStore(config.paths.requestsDB)
requestsById.ready
  .then(() => requestsById.list())
  .then(requests => console.log(requests))

// Exports

function create(r1, r2) {
  const id = cuid()
  const folder = `${config.paths.requests}/${id}`
  const inputPath = {
    r1: r1 ? `${folder}/input-1.fq` : undefined,
    r2: r2 ? `${folder}/input-2.fq` : undefined,
  }
  const subsampledPath = {
    r1: r1 ? `${folder}/input-1-subsampled.fa` : undefined,
    r2: r2 ? `${folder}/input-2-subsampled.fa` : undefined,
  }
  const request = {
    id,
    folder,
    inputPath,
    subsampledPath,
    lastUpdate: Date.now(),
    results: {},
  }

  return Promise.resolve()
  .then(() => fs.mkdir(folder))
  .then(() => Promise.all([
    r1 && fs.rename(r1, inputPath.r1),
    r2 && fs.rename(r2, inputPath.r2),
  ]))
  .then(() => Promise.all([
    r1 && generateRandomReads(inputPath.r1, subsampledPath.r1),
    r2 && generateRandomReads(inputPath.r2, subsampledPath.r2),
  ]))
  .then(() => requestsById.set(id, request))
  .then(() => (console.log(request), request))
}

function get(id) {
  return requestsById.get(id)
}

function update(id, value) {
  return requestsById.update(id, value)
}

function destroy(id) {
  return requestsById.get(id)
  .then(request => {

    if (request.deleting)
      return rejectWith(`Request ${id} being deleted`)

    request.deleting = true

    // Spawn task destruction and complete request
    // destruction later as running tasks cannot be
    // stopped.
    Task.destroy(id)
    .then(() => del([request.folder]))
    .then(() => requestsById.remove(id))
    // XXX: Error not caught

    return Promise.resolve()
  })
}
