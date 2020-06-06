import { configureStore } from '@reduxjs/toolkit';
import otpReducer from './otpSlice';

export const store = configureStore({
  reducer: {
    otp: otpReducer,
  },
});
