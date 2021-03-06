import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import inputFilesReducer from './reducers/inputFiles.js'
import readLengthsReducer from './reducers/readLengths.js'
import referencesReducer from './reducers/references.js'
import requestReducer from './reducers/request.js'
import speciesReducer from './reducers/species.js'

const isDevelopment = process.env.NODE_ENV === 'development'

const middleware = [thunk, logger]

const store = configureStore({
  middleware,
  reducer: {
    inputFiles: inputFilesReducer,
    readLengths: readLengthsReducer,
    references: referencesReducer,
    request: requestReducer,
    species: speciesReducer,
  },
  preloadedState: isDevelopment && ('state' in localStorage) ?
    JSON.parse(localStorage.state) :
    undefined,
})

if (isDevelopment) {
  const saveState = () => {
    localStorage.state = JSON.stringify(store.getState())
  }

  window.addEventListener('unload', saveState)

  window.clearStore = () => {
    window.removeEventListener('unload', saveState)
    delete localStorage.state
    delete localStorage.activeStep
    delete localStorage.enabledStep
    window.location.search = ''
  }
}

export default store;
