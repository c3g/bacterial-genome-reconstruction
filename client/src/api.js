/*
 * requests.js
 */


import axios from 'axios'
import QS from 'qs'


export const identifyClosestSpecies = (file) =>
  POST(`/identify-closest-species`, form({ file }))

export const identifyClosestReferences = ({ id, genus }) =>
  POST(`/identify-closest-references`, { id, genus })


function fetchAPI(url, params, options = {}) {
  const { method = 'get', ...other } = options

  let finalURL = process.env.PUBLIC_URL + '/api' + url
  let data

  if (method === 'post' && params)
    data = params

  if (method === 'get' && params)
    finalURL += `?${QS.stringify(params)}`

  const config = {
    method: method,
    url: finalURL,
    data: data,
    ...other
  }

  return axios(config).then(({ data }) => {
    if (data.ok)
      return Promise.resolve(data.data)
    return Promise.reject(createError(data))
  })
}

/* eslint-disable no-unused-vars */
function GET(url, params, options = {})  { return fetchAPI(url, params, { method: 'get', ...options }) }
function POST(url, params, options = {}) { return fetchAPI(url, params, { method: 'post', ...options }) }
/* eslint-enable no-unused-vars */

function createError(data) {
  const e = new Error(data.message)
  e.type  = data.type
  e.stack = data.stack
  e.fromServer = true
  return e
}

function form(params) {
  const formData = new FormData()
  Object.keys(params).forEach(key => {
    const value = params[key]
    formData.append(key, value)
  })
  return formData
}

