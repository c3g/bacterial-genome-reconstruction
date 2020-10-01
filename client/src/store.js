import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import fastqInputReducer from './reducers/fastqInput.js'
import generalReducer from './reducers/general.js'
import speciesReducer from './reducers/species.js'
import referencesReducer from './reducers/references.js'
// import counterReducer from './features/counter/counterSlice'

const middleware = [thunk, logger]

export default configureStore({
  middleware,
  reducer: {
    // counter: counterReducer,
    fastqInput: fastqInputReducer,
    general: generalReducer,
    species: speciesReducer,
    references: referencesReducer,
  },
});
