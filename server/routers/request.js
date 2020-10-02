/*
 * request.js
 */

const express = require('express')
const router = express.Router()

const Request = require('../helpers/request')
const { apiRoute } = require('../helpers/handlers.js')

/* POST create */
router.use('/create', apiRoute(req =>
  Request.create(req.files.file.path)
))

/* GET retrieve request */
router.use('/get/:id', apiRoute(req =>
  Request.get(req.params.id)
))

/* POST destroy request */
router.use('/destroy/:id', apiRoute(req =>
  Request.destroy(req.params.id)
))

module.exports = router
