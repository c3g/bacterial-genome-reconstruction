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

window.files = new Map()

export const fastqInput = createSlice({
  name: 'fastqInput',
  initialState: initialState,
  reducers: {
    setFiles: (state, action) => {
      if (action.payload.r1 !== undefined) {
        if (state.r1.file)
          window.files.delete(state.r1.file)
        state.r1.file = action.payload.r1
      }
      if (action.payload.r2 !== undefined) {
        if (state.r2.file)
          window.files.delete(state.r2.file)
        state.r2.file = action.payload.r2
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

export const { setMessages, clear } = fastqInput.actions;

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
  return fastqInput.actions.setFiles({ r1, r2 })
}

export default fastqInput.reducer;
