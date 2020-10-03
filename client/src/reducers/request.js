import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api'

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
  async (file, { dispatch: _ }) => {
    _(setIsLoading(true))
    try {
      const data = await api.request.create(file)
      _(setData(data))
      _(setIsLoaded(true))
    } catch (e) {
      _(setMessage(e.message))
    }
    _(setIsLoading(false))
  })

export default request.reducer;
