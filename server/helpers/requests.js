/*
 * storage.js
 */

const fs = require('fs').promises
const del = require('del')
const uuid = require('uuid').v4

const { rejectWith } = require('./promise')
const config = require('../config')


module.exports = {
  create,
  get,
  destroy,
}


const requestsById = {}


function create(filepath) {
  const id = uuid()
  const folder = `${config.paths.requests}/${id}`
  const inputPath = `${folder}/input.fq`
  const request = { id, folder, inputPath }

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

  return del([request.folder])
  .then(() => {
    delete requestsById[id]
  })
}
