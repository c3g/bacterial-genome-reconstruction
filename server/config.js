/*
 * config.js
 */

const path = require('path')

module.exports = {
  paths: {
    database: path.join(__dirname, 'data', 'db.sqlite'),
  },

  google: {
    auth: {
      clientID:     '395363823406-h7lrbulohi799i6o0itcd9hn3mnam8qj.apps.googleusercontent.com',
      clientSecret: 'OZjRikbhWQ6dwu-0LvyDsagb',
      callbackURL:  'http://localhost:3001/auth/google/callback',
    },
    callbackURL:  'http://localhost:3001/auth/google/callback',
  },
  authorizedEmail: 'rom7011@gmail.com', 
}
