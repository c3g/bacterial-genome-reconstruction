import { createSlice } from '@reduxjs/toolkit';

export const fastqInput = createSlice({
  name: 'fastqInput',
  initialState: {
    filename: undefined,
    reads: undefined,
    message: undefined
  },
  reducers: {
    setFile: (state, action) => {
      state.filename = action.payload
    },
    setReads: (state, action) => {
      state.reads = action.payload
    },
    setMessage: (state, action) => {
      state.message = action.payload
    },
  },
});

export const { setFile, setReads, setMessage } = fastqInput.actions;

export default fastqInput.reducer;
