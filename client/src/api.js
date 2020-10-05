/*
 * requests.js
 */


import axios from 'axios'
import QS from 'qs'

const BASE_ENDPOINT =
  process.env.NODE_ENV === 'production' ?
    process.env.PUBLIC_URL + '/api' :
    /* Normally we'd let webpack-dev-server set this and handle
     * request re-routing, however it doesn't handle file downloads
     * correctly */
    'http://localhost:3001/api'

export const request = {
  create: file => POST(`/request/create`, form({ file })),
  get: id => GET(`/request/get/${id}`),
  destroy: id => POST(`/request/destroy/${id}`),
}

export const task = {
  identifyClosestSpecies: requestId =>
    POST(`/task/create/${requestId}/identify-closest-species`),
  identifyClosestReferences: (requestId, genus) =>
    POST(`/task/create/${requestId}/identify-closest-references`, { genus }),
  readLengthOptimization: (requestId, genus, accession) =>
    POST(`/task/create/${requestId}/read-length-optimization`, { genus, accession }),
  status: requestId => POST(`/task/status/${requestId}`),
  destroy: requestId => POST(`/task/destroy/${requestId}`),
}

export const urlFor = {
  download: {
    identifyClosestSpecies: requestId =>
      `${BASE_ENDPOINT}/task/download/${requestId}/identify-closest-species`,
    identifyClosestReferences: (requestId) =>
      `${BASE_ENDPOINT}/task/download/${requestId}/identify-closest-references`,
    readLengthOptimization: (requestId) =>
      `${BASE_ENDPOINT}/task/download/${requestId}/read-length-optimization`,
  },
}



// Helpers

/* eslint-disable no-unused-vars */
function GET(url, params, options = {})  { return fetchAPI(url, params, { method: 'get', ...options }) }
function POST(url, params, options = {}) { return fetchAPI(url, params, { method: 'post', ...options }) }
/* eslint-enable no-unused-vars */

function fetchAPI(url, params, options = {}) {
  const { method = 'get', ...other } = options

  let finalURL = BASE_ENDPOINT + url
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

