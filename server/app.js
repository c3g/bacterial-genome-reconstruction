global.Promise = require('bluebird')
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const formData = require('express-form-data');
const compression = require('compression');

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
app.use(formData.parse())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// API
app.use('/api', require('./api'))


/*
 * Redirect handler
 * We need to redirect all other routes to the app, e.g. /samples, /settings, etc.
 */

app.use((req, res, next) => {
  res.redirect('/')
})


// Error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error   = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})


module.exports = app
