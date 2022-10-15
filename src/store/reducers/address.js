import {createSlice} from '@reduxjs/toolkit';

export const addressSlice = createSlice({
  name: 'address',
  initialState: {
    value: {
      address: '',
      coords: [],
      title: '',
      description: ''
    },
    reducers: {
      addAddress: (state) => {

      }
    }
  }
});

export const addAddress = addressSlice.actions;
export default addressSlice.reducer;
