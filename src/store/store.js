import {configureStore} from '@reduxjs/toolkit';
import addressReducer from './reducers/address';

export default configureStore({
  reducer: {
    address: addressReducer
  }
});
