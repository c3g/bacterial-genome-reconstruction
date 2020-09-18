import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  requestId: undefined,
}

export const general = createSlice({
  name: 'general',
  initialState: initialState,
  reducers: {
    setRequestId: (state, action) => {
      state.requestId = action.payload
    },
  },
});

export const { setRequestId } = general.actions;

export default general.reducer;
