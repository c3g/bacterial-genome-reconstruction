import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api'
import { delay } from '../helpers/promise'

const initialState = {
  isLoading: false,
  isLoaded: false,
  status: undefined,
  order: undefined,
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
    update: (state, action) => {
      state.status = action.payload.status
      state.order = action.payload.order
    },
    setMessage: (state, action) => {
      state.message = action.payload
    },
    setValue: (state, action) => {
      state.value = action.payload
    },
    setData: (state, action) => {
      state.isLoaded = true
      state.data = action.payload
    },
    clear: (state) => {
      Object.keys(initialState).forEach(key => {
        state[key] = initialState[key]
      })
    }
  },
});

export const { setIsLoading, setIsLoaded, update, setMessage, setValue, setData, clear } = species.actions;

export const identifyClosestSpecies = createAsyncThunk(
  'species/identifyClosestSpecies',
  async (params, { dispatch: _, getState }) => {
    const requestId = getState().request.data.id

    _(setIsLoading(true))
    try {

      await api.task.identifyClosestSpecies(requestId)

      let task
      do {
        await delay(5000)
        task = await api.task.status(requestId)
        _(update(task))
      } while (task.status !== 'COMPLETED')

      if (task.results)
        _(setData(task.results))
      else
        _(setMessage(task.error))

    } catch (e) {
      _(setMessage(e.message))
    }
    _(setIsLoading(false))
  })

export default species.reducer;
