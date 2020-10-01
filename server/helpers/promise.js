/*
 * promise.js
 */


module.exports = {
  rejectWith,
}

function rejectWith(message, type = undefined) {
  const e = new Error(message)
  if (type)
    e.type = type
  return Promise.reject(e)
}
