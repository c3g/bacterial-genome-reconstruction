import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api'
import * as LocationQuery from '../helpers/location-query'

const initialState = {
  isLoading: false,
  isLoaded: false,
  message: undefined,
  data: undefined,
}

export const request = createSlice({
  name: 'request',
  initialState: initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setIsLoaded: (state, action) => {
      state.isLoaded = action.payload
    },
    setMessage: (state, action) => {
      state.message = action.payload
    },
    setData: (state, action) => {
      state.data = action.payload
    },
    clear: (state) => {
      Object.keys(initialState).forEach(key => {
        state[key] = initialState[key]
      })
    }
  },
});

export const { setIsLoading, setIsLoaded, setMessage, setData, clear } = request.actions;

export const createRequest = createAsyncThunk(
  'request/create',
  async ({ r1, r2 }, { dispatch: _ }) => {
    _(setIsLoading(true))
    try {
      const data = await api.request.create({ r1, r2 })
      _(setData(data))
      _(setIsLoaded(true))
      _(setIsLoading(false))

      LocationQuery.insert('id', data.id)
    } catch (e) {
      _(setMessage(e.message))
      _(setIsLoading(false))
      throw e
    }
  })

export default request.reducer;
