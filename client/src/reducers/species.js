import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { setRequestId } from './general'
import * as api from '../api'

const initialState = {
  isLoading: false,
  isLoaded: false,
  message: undefined,
  value: undefined,
  data: [],
}

export const species = createSlice({
  name: 'species',
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

export const { setIsLoading, setIsLoaded, setMessage, setValue, setData, clear } = species.actions;

export const identifyClosestSpecies = createAsyncThunk(
  'species/identifyClosestSpecies',
  async (file, { dispatch: _ }) => {
    _(setIsLoading(true))
    try {
      const response = await api.identifyClosestSpecies(file)
      _(setRequestId(response.id))
      _(setData(response.species))
      _(setIsLoaded(true))
    } catch (e) {
      _(setMessage(e.message))
    }
    _(setIsLoading(false))
  })

export default species.reducer;
