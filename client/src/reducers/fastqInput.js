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

export const fastqInput = createSlice({
  name: 'fastqInput',
  initialState: initialState,
  reducers: {
    setFiles: (state, action) => {
      state.r1.file = action.payload.r1 === null ? state.r1.file : action.payload.r1
      state.r2.file = action.payload.r2 === null ? state.r2.file : action.payload.r2
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

export const { setFiles, setMessages, clear } = fastqInput.actions;

export default fastqInput.reducer;
