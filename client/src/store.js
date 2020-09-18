import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import fastqInputReducer from './reducers/fastqInput.js'
import speciesReducer from './reducers/species.js'
// import counterReducer from './features/counter/counterSlice'

const middleware = [thunk, logger]

export default configureStore({
  middleware,
  reducer: {
    // counter: counterReducer,
    fastqInput: fastqInputReducer,
    species: speciesReducer,
  },
});
