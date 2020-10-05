global.Promise = require('bluebird')
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const formData = require('express-form-data')
const compression = require('compression')

const config = require('./config')

// Setup application
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


// Middlewares
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(compression())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(formData.parse({ uploadDir: config.paths.tmp, autoClean: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

if (process.env.NODE_ENV === 'development')
  app.use(cors())


// API
app.use('/api/request', require('./routers/request'))
app.use('/api/task',    require('./routers/task'))

app.use('/api', (req, res) => {
  res.status(404)
  res.json({ ok: false, message: '404', url: req.originalUrl })
  res.end()
})


// Redirect handler
// We need to redirect all other routes to the app, e.g. /samples, /settings, etc.
app.use((req, res, next) => {
  res.redirect('/')
})

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error   = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})


module.exports = app
