/*
 * handlers.js
 */


const errorHandler = res => err => {
  res.json({
    ok: false,
    message: err.toString(),
    type: err.type,
    stack: err.stack.split('\n')
  })
  res.end()
}

const dataHandler = res => data => {
  res.json({ ok: true, data: data })
  res.end()
}

const okHandler = res => data => {
  res.json({ ok: true })
  res.end()
}

const apiRoute = fn => {
  return (req, res, next) =>
    fn(req, res, next)
    .then(dataHandler(res))
    .catch(errorHandler(res))
}

module.exports = {
  okHandler,
  dataHandler,
  errorHandler,
  apiRoute,
}
