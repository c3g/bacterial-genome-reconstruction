/*
 * task.js
 */


const getControllablePromise = require('./get-controllable-promise')

const {
  rejectNotFound,
  rejectAlreadyExists,
} = require('./promise')


/**
 * @enum {string}
 */
const Status = {
  /** Is in `tasks` */
  WAITING:   'WAITING',
  /** Is in `tasks` at index 0 */
  RUNNING:   'RUNNING',
  /** Is not in `tasks` */
  COMPLETED: 'COMPLETED',
}

module.exports = {
  create,
  get,
  destroy,
  serialize,
  Status,
}

/**
 * @callback TaskCallback
 * @returns {Promise}
 */

/**
 * Represents a user-submitted task
 * Only one task per requestId can exist at a time
 * @typedef {Object} Task
 * @property {string} requestId - ID of the associated request
 * @property {string} name - Name of the task
 * @property {number} order - Approximate position in queue
 * @property {Status} status - Status of the task
 * @property {boolean} isDestroying - If the task is being destroyed
 * @property {Promise} didComplete - Promise that resolves after completinog
 * @property {TaskCallback} run - Function that executes the task
 * @property {any} results - Return value of `run`
 * @property {any} error - Error, if any
 */

/**
 * Determines the order of the tasks
 * @type {Array.<string>}
 */
let tasks = []

/**
 * Contains the task description
 * @type {Object.<string, Task>}
 */
let tasksById = {}

/**
 * If the task runner is running
 * @type {boolean}
 */
let running = false


// Exports

function create(requestId, name, run) {
  if (tasks.some(t => t.requestId === requestId))
    return rejectAlreadyExists(`A task for request "${requestId}" already exists`)

  const task = {
    requestId,
    name,
    order: -1,
    status: Status.WAITING,
    didComplete: getControllablePromise(),
    run,
    results: undefined,
    error: undefined,
  }

  tasks.push(requestId)
  tasksById[requestId] = task
  updateOrders()

  runTasks()

  return Promise.resolve(task)
}

function get(requestId) {
  const task = tasksById[requestId]

  if (!task)
    return rejectNotFound('No task found for request ' + requestId)

  return Promise.resolve(task)
}

function destroy(requestId) {
  const task = tasksById[requestId]

  if (!task)
    return Promise.resolve() // Ignore

  if (task.isDestroying)
    return Promise.resolve() // Ignore

  switch (task.status) {
    case Status.WAITING: {
      delete tasksById[requestId]
      tasks = tasks.filter(id => id !== requestId)
      updateOrders()
      return Promise.resolve()
    }

    case Status.COMPLETED: {
      delete tasksById[requestId]
      return Promise.resolve()
    }

    case Status.RUNNING: {
      // Cannot stop running task
      task.isDestroying = true
      return task.didComplete.then(() => {
        delete tasksById[requestId]
      })
    }
  }

  throw new Error('unreachable')
}

function serialize(t) {
  // t.results: { summaryPath, readLengthPath, ..., results: [] }
  const results = t.results ?
    t.results.results : undefined

  return {
    name: t.name,
    order: t.order,
    status: t.status,
    results: results,
    error: t.error,
  }
}


// Helpers

function updateOrders() {
  tasks.forEach((requestId, order) => {
    tasksById[requestId].order = order
  })
}

function runTasks() {
  console.log('runTasks: enter')

  if (running) {
    console.log('runTasks: return (already-running)')
    return
  }

  if (tasks.length === 0) {
    console.log('runTasks: return (finished)')
    running = false
    return
  }

  running = true

  const nextTaskId = tasks[0]
  const nextTask = tasksById[nextTaskId]
  nextTask.status = Status.RUNNING

  console.log(`runTasks: tick (${nextTask.name})`)

  return nextTask.run()
  .then(results => {
    nextTask.results = results
  })
  .catch(error => {
    nextTask.error = error
  })
  .then(() => {
    tasks.shift()
    updateOrders()

    nextTask.status = Status.COMPLETED
    nextTask.didComplete.resolve()
  })
  .then(() => {
    running = false
    return runTasks() // Loop
  })
}
