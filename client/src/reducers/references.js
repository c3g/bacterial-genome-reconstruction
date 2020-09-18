import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { setRequestId } from './general'
import * as api from '../requests'

const initialState = {
  isLoading: false,
  isLoaded: false,
  message: undefined,
  value: undefined,
  data: [],
}

export const references = createSlice({
  name: 'references',
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
    setValue: (state, action) => {
      state.value = action.payload
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

export const { setIsLoading, setIsLoaded, setMessage, setValue, setData, clear } = references.actions;

export const identifyClosestReferences = createAsyncThunk(
  'references/identifyClosestReferences',
  async (params, { dispatch: _ }) => {
    _(setIsLoading(true))
    try {
      const response = await api.identifyClosestReferences(params)
      _(setIsLoaded(true))
      _(setData(response.results))
    } catch (e) {
      _(setMessage(e.message))
    }
    _(setIsLoading(false))
  })

export default references.reducer;
