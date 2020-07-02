import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  r1: {
    filename: undefined,
    reads: undefined,
    message: undefined,
  },
  r2: {
    filename: undefined,
    reads: undefined,
    message: undefined,
  },
}

export const fastqInput = createSlice({
  name: 'fastqInput',
  initialState: initialState,
  reducers: {
    setFilenames: (state, action) => {
      state.r1.filename = action.payload.r1 === null ? state.r1.filename : action.payload.r1
      state.r2.filename = action.payload.r2 === null ? state.r2.filename : action.payload.r2
    },
    setReads: (state, action) => {
      state.r1.reads = action.payload.r1 === null ? state.r1.reads : action.payload.r1
      state.r2.reads = action.payload.r2 === null ? state.r2.reads : action.payload.r2
    },
    setMessages: (state, action) => {
      state.r1.message = action.payload.r1 === null ? state.r1.message : action.payload.r1
      state.r2.message = action.payload.r2 === null ? state.r2.message : action.payload.r2
    },
    clear: (state) => {
      state.r1 = initialState.r1
      state.r2 = initialState.r2
    }
  },
});

export const { setFilenames, setReads, setMessages, clear } = fastqInput.actions;

export default fastqInput.reducer;
