import { configureStore } from '@reduxjs/toolkit';
import excelBagReducer from './reducers/excelBagReducer';


export const store = configureStore({
  reducer: {
    excelBag: excelBagReducer,
  },
})