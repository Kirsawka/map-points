import {createSlice} from '@reduxjs/toolkit';

export const addressSlice = createSlice({
  name: 'address',
  initialState: {
    value: JSON.parse(localStorage.getItem('addresses')) || [],
  },
  reducers: {
    addAddress: (state,
                 action) => {
      state.value = [...state.value, action.payload];
    }
  }
});

export const {addAddress} = addressSlice.actions;
export default addressSlice.reducer;
