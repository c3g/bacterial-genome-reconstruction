import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  r1: {
    file: undefined,
    message: undefined,
  },
  r2: {
    file: undefined,
    message: undefined,
  },
}

/*
 * HTMLFile objects aren't stored in redux state because they aren't serializable
 * and redux complains about it.
 */
window.files = new Map()

export const inputFiles = createSlice({
  name: 'inputFiles',
  initialState: initialState,
  reducers: {
    setFiles: (state, action) => {
      if (action.payload.r1 !== undefined) {
        if (state.r1.file)
          window.files.delete(state.r1.file)
        state.r1.file = action.payload.r1
        state.r1.message = undefined
      }
      if (action.payload.r2 !== undefined) {
        if (state.r2.file)
          window.files.delete(state.r2.file)
        state.r2.file = action.payload.r2
        state.r2.message = undefined
      }
    },
    setMessages: (state, action) => {
      state.r1.message = action.payload.r1 === undefined ? state.r1.message : action.payload.r1
      state.r2.message = action.payload.r2 === undefined ? state.r2.message : action.payload.r2
    },
    clear: (state) => {
      if (state.r1.file)
        window.files.delete(state.r1.file)
      if (state.r2.file)
        window.files.delete(state.r2.file)
      state.r1 = initialState.r1
      state.r2 = initialState.r2
    }
  },
});

export const { setMessages, clear } = inputFiles.actions;

export const setFiles = (payload) => {
  let r1, r2
  if (payload.r1 !== undefined) {
    if (payload.r1 === null) {
      r1 = null
    } else {
      r1 = payload.r1.name
      window.files.set(payload.r1.name, payload.r1)
    }
  }
  if (payload.r2 !== undefined) {
    if (payload.r2 === null) {
      r2 = null
    } else {
      r2 = payload.r2.name
      window.files.set(payload.r2.name, payload.r2)
    }
  }
  return inputFiles.actions.setFiles({ r1, r2 })
}

export default inputFiles.reducer;
