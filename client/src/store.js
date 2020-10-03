import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import fastqInputReducer from './reducers/fastqInput.js'
import readLengthsReducer from './reducers/readLengths.js'
import referencesReducer from './reducers/references.js'
import requestReducer from './reducers/request.js'
import speciesReducer from './reducers/species.js'

const middleware = [thunk, logger]

export default configureStore({
  middleware,
  reducer: {
    fastqInput: fastqInputReducer,
    readLengths: readLengthsReducer,
    references: referencesReducer,
    request: requestReducer,
    species: speciesReducer,
  },
});
