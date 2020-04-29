import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import logger from 'redux-logger'

import fastqInputReducer from './reducers/fastqInput.js'
import counterReducer from './features/counter/counterSlice'

const middleware = [...getDefaultMiddleware(), logger]

export default configureStore({
  middleware,
  reducer: {
    counter: counterReducer,
    fastqInput: fastqInputReducer,
  },
});
