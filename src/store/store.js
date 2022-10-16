import {configureStore} from '@reduxjs/toolkit';
import addressReducer from './reducers/address';
import settingsReducer from './reducers/settings';

export default configureStore({
  reducer: {
    address: addressReducer,
    settings: settingsReducer,
  }
});
