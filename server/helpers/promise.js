/*
 * promise.js
 */


const ErrorCode = {
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
}

module.exports = {
  ErrorCode,
  rejectWith,
  rejectNotFound,
  rejectAlreadyExists,
  ignoreNotFound,
  ignoreAlreadyExists,
}


function rejectWith(message, code = undefined) {
  const e = new Error(message)
  if (code)
    e.code = code
  return Promise.reject(e)
}

function rejectNotFound(message) {
  const e = new Error(message)
  e.code = ErrorCode.NOT_FOUND
  return Promise.reject(e)
}

function rejectAlreadyExists(message) {
  const e = new Error(message)
  e.code = ErrorCode.ALREADY_EXISTS
  return Promise.reject(e)
}

function ignoreNotFound(err) {
  if (err.code === ErrorCode.NOT_FOUND)
    return Promise.resolve()
  return Promise.reject(err)
}

function ignoreAlreadyExists(err) {
  if (err.code === ErrorCode.ALREADY_EXISTS)
    return Promise.resolve()
  return Promise.reject(err)
}
