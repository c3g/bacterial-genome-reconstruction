/*
 * get-controllable-promise.js
 */


module.exports = function getControllablePromise() {
  let resolve
  let reject
  let promise = new Promise((r, j) => {
    resolve = r
    reject = j
  })
  promise.resolve = resolve
  promise.reject = reject
  return promise
}

