import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api'
import { delay } from '../helpers/promise'
import extractGenus from '../helpers/extract-genus'

const initialState = {
  isLoading: false,
  isLoaded: false,
  status: undefined,
  order: undefined,
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

export const { setIsLoading, setIsLoaded, update, setMessage, setValue, setData, clear } = references.actions;

export const identifyClosestReferences = createAsyncThunk(
  'references/identifyClosestReferences',
  async (params, { dispatch: _, getState }) => {
    const state = getState()

    if (!state.request.data.id) return
    if (!state.species.value)   return

    const id = state.request.data.id
    const genus = extractGenus(state.species.value.name)

    _(setIsLoading(true))
    try {
      await api.task.identifyClosestReferences(id, genus)

      let task = await api.task.status(id)
      _(update(task))
      while (task.status !== 'COMPLETED') {
        await delay(5000)
        task = await api.task.status(id)
        _(update(task))
      }

      if (task.results)
        _(setData(task.results.data))
      else
        _(setMessage(task.error))

      _(setIsLoading(false))
    } catch (e) {
      _(setMessage(e.message))
      _(setIsLoading(false))
      throw e
    }
  })

export default references.reducer;
