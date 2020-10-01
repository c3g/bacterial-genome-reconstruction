import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api'

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
  async (genus, { dispatch: _, getState }) => {
    const id = getState().general.requestId
    debugger
    _(setIsLoading(true))
    try {
      const response = await api.identifyClosestReferences({ id, genus })
      _(setData(response.references))
      _(setIsLoaded(true))
    } catch (e) {
      _(setMessage(e.message))
    }
    _(setIsLoading(false))
  })

export default references.reducer;
