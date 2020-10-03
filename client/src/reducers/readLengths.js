import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api'
import extractGenus from '../helpers/extract-genus'

const initialState = {
  isLoading: false,
  isLoaded: false,
  message: undefined,
  value: undefined,
  data: [],
}

export const readLengths = createSlice({
  name: 'readLengths',
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

export const { setIsLoading, setIsLoaded, setMessage, setValue, setData, clear } = readLengths.actions;

export const readLengthOptimization = createAsyncThunk(
  'readLengths/readLengthOptimization',
  async (params, { dispatch: _, getState }) => {
    const state = getState()

    if (!state.general.requestId) return
    if (!state.species.value)     return
    if (!state.references.value)  return

    const id = state.general.requestId
    const genus = extractGenus(state.species.value.name)
    const accession = state.references.value.accession

    _(setIsLoading(true))
    try {
      const response = await api.task.readLengthOptimization({ id, genus, accession })
      _(setData(response.readLengths))
      _(setIsLoaded(true))
    } catch (e) {
      _(setMessage(e.message))
    }
    _(setIsLoading(false))
  })

export default readLengths.reducer;
