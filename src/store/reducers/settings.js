import {createSlice} from '@reduxjs/toolkit';

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    value: {
      showSideBar: false,
      showPlacemarks: true,
      showLoader: true,
    }
  },
    reducers: {
      setShowSideBar: (state) => {
        state.value.showSideBar = !state.value.showSideBar;
      },
      setShowPlacemarks: (state) => {
        state.value.showPlacemarks = !state.value.showPlacemarks;
      },
      setShowLoader: (state) => {
        state.value.showLoader = !state.value.showLoader;
      },
    }
});

export const { setShowSideBar, setShowPlacemarks, setShowLoader } = settingsSlice.actions;
export default settingsSlice.reducer;
