/*
 * parse-form.js
 */

const formidable = require('formidable')

module.exports = function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err)
        reject(err)
      else
        resolve({ fields, files })
    })
  })
}
