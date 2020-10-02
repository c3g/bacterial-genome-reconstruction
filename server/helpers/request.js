/*
 * storage.js
 */

const fs = require('fs').promises
const del = require('del')
const cuid = require('cuid')

const Task = require('./task')
const { rejectWith } = require('./promise')
const config = require('../config')


module.exports = {
  create,
  get,
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

/** @type {Object.<string, Request>} */
const requestsById = {}


// Exports

function create(filepath) {
  const id = cuid()
  const folder = `${config.paths.requests}/${id}`
  const inputPath = `${folder}/input.fq`
  const request = {
    id,
    folder,
    inputPath,
    results: {},
  }

  requestsById[id] = request

  return fs.mkdir(folder)
  .then(() => fs.rename(filepath, inputPath))
  .then(() => request)
}

function get(id) {
  const request = requestsById[id]

  if (!request)
    return rejectWith('No request found for id ' + id)

  return Promise.resolve(request)
}

function destroy(id) {
  const request = requestsById[id]

  if (!request)
    return rejectWith('No request found for id ' + id)

  if (request.deleting)
    return rejectWith(`Request ${id} being deleted`)

  request.deleting = true

  // Spawn task destruction and complete request
  // destruction later as running tasks cannot be
  // stopped.
  Task.destroy(id)
  .then(() => del([request.folder]))
  .then(() => {
    delete requestsById[id]
  })
  // XXX: Error not caught

  return Promise.resolve()
}
