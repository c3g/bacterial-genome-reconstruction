/*
 * request.js
 *
 * Requests & Tasks
 * ================
 *
 * Requests & tasks modelize the operations that a user performs.
 *
 * Requests are where the data for all steps of the tool is stored. They
 * have an unique ID, a folder, and may have results attached to them for
 * any task that has been run by the user. A request must be created before
 * any task can be run. The request takes as input the R1 and optionally the R2
 * files that will be operated on by the different steps.
 *
 * Tasks are runnable, and they encapsulate one run of one step of the tool.
 * For example, "identify-closest-species" is one task. Tasks are run in a
 * queue to prevent overloading the server's resources.
 *
 * For each request, there can be only one task running and no more. For that
 * reason, tasks don't have a unique ID but use the request ID for identification.
 *
 * Requests (and their associated tasks) are cleanup up each X days (config-defined)
 * by the `cleanup()` procedure implemented below.
 *
 */


const fs = require('fs').promises
const path = require('path')
const _ = require('rambda')
const del = require('del')
const cuid = require('cuid')
const { KeyValueStore } = require('sqlite-objects')
const { generateRandomReads } = require('../../bacterial-genome-reconstruction')

const Task = require('./task')
const { rejectWith } = require('./promise')
const config = require('../config')

const folder = id => path.join(config.paths.requests, id)

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

let requestCleanupInterval

requestsById.ready
  /* .then(() => {
   *   if (process.env.NODE_ENV === 'development')
   *     return requestsById.values().then(requests =>
   *       console.log(requests, requests.length))
   * }) */
  .then(() => {
    requestCleanupInterval = setInterval(cleanup, config.requests.cleanupInterval)
    requestCleanupInterval.unref()
    cleanup()
  })

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
  // `id` may not exist in the store
  return requestsById.get(id)
  .then(request => {

    if (request) {
      if (request.deleting)
        return rejectWith(`Request ${id} being deleted`)

      request.deleting = true
    }

    // Spawn task destruction and complete request
    // destruction later as running tasks cannot be
    // stopped.
    Task.destroy(id)
    .then(() => del([folder(id)]))
    .then(() => requestsById.delete(id))
    // XXX: Error not caught

    return true
  })
}


// Helpers

async function cleanup() {
  /*
   * This function ensures that request resources are released. There
   * are (unfortunately) 2 sources of data for requests: folders stored
   * on the file system, and data stored in the key-value store.
   *
   * The cleanup function starts by identifying expired directories (where
   * creation-time + keep-for-time is past) and cleaning up those ones.
   * It then lists all ids contained in the key-value store and cleanup
   * any id that hasn't been seen in the first phase.
   *
   * This ensures that no resource is leaked.
   *
   * Currently there is a race condition, if a request is being created it
   * creates the directories first. If the cleanup function runs at that
   * moment it is possible that it will delete the directory before the
   * creation function writes the data to the store. However the cleanup
   * function should run in the magnitude of days so it shouldn't be a
   * problem, unless the user is unlucky which really is their fault.
   */

  console.log('requests-cleanup: start')

  /*
   * First, cleanup the directories
   */

  const expiredRequestIds = []
  const validRequestIds = new Set()

  const directories = await fs.readdir(config.paths.requests)
  const stats = await Promise.all(directories.map(d =>
    fs.stat(folder(d))))

  console.log(`requests-cleanup: found ${directories.length} directories`)

  for (let [id, stat] of _.zip(directories, stats)) {
    const expiryTime = stat.birthtimeMs + config.requests.keepFor
    const mustDelete = Date.now() > expiryTime

    // console.log(id, mustDelete, expiryTime)

    if (mustDelete)
      expiredRequestIds.push(id)
    else
      validRequestIds.add(id)
  }

  if (expiredRequestIds.length)
    console.log(`requests-cleanup: deleting ${expiredRequestIds.length} expired requests`)

  for (let id of expiredRequestIds) {
    await destroy(id)
  }

  /*
   * Finally, cleanup the store from any invalid request
   */

  const ids = await requestsById.keys()

  console.log(`requests-cleanup: found ${ids.length} requests`)

  const invalidRequestIds = ids.filter(id => !validRequestIds.has(id))

  if (invalidRequestIds.length)
    console.log(`requests-cleanup: deleting ${invalidRequestIds.length} invalid requests`)

  for (let id of invalidRequestIds) {
    await destroy(id)
  }

  console.log(`requests-cleanup: done`)
}
