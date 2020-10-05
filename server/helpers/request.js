/*
 * storage.js
 */

const fs = require('fs').promises
const del = require('del')
const cuid = require('cuid')
const { KeyValueStore } = require('sqlite-objects')

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

function create(filepath) {
  const id = cuid()
  const folder = `${config.paths.requests}/${id}`
  const inputPath = `${folder}/input.fq`
  const request = {
    id,
    folder,
    inputPath,
    lastUpdate: Date.now(),
    results: {},
  }

  return Promise.resolve()
  .then(() => fs.mkdir(folder))
  .then(() => fs.rename(filepath, inputPath))
  .then(() => requestsById.set(id, request))
  .then(() => request)
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
