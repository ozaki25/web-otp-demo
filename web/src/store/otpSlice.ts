import { Dispatch } from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { postPhoneNumber } from '../api/index';
import { v4 as uuid } from 'uuid';

type OtpState = {
  loading: boolean;
  error: {} | null;
  phoneNumber: string;
  otp: string;
  id: string;
};

const initialState: OtpState = {
  loading: false,
  error: null,
  phoneNumber: '',
  otp: '',
  id: '',
};

// Slice
export const otpSlice = createSlice({
  name: 'otp',
  initialState,
  reducers: {
    setId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
    setPhoneNumber(state, action: PayloadAction<string>) {
      state.phoneNumber = action.payload;
    },
    setOtp(state, action: PayloadAction<string>) {
      state.otp = action.payload;
    },
    start(state) {
      state.loading = true;
      state.error = null;
    },
    end(state) {
      state.loading = false;
      state.error = null;
    },
    failure(state, action: PayloadAction<{}>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Actions
export const {
  setId,
  setPhoneNumber,
  setOtp,
  start,
  end,
  failure,
} = otpSlice.actions;

export const sendPhoneNumber = (onSuccess: () => void) => async (
  dispatch: Dispatch<{}>,
  state: () => { otp: OtpState },
) => {
  try {
    dispatch(start());
    dispatch(setId(uuid()));
    const {
      otp: { id, phoneNumber },
    } = state();
    await postPhoneNumber({ id, phoneNumber });
    dispatch(end());
    onSuccess();
  } catch (error) {
    console.log(error);
    dispatch(failure(error.stack));
  }
};

// Selectors
export const selectId = ({ otp }: { otp: OtpState }) => otp.id;
export const selectPhoneNumber = ({ otp }: { otp: OtpState }) =>
  otp.phoneNumber;
export const selectOtp = ({ otp }: { otp: OtpState }) => otp.otp;
export const selectLoading = ({ otp }: { otp: OtpState }) => otp.loading;

// Reducer(must be default export)
export default otpSlice.reducer;
