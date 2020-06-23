import React, { ChangeEvent, MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectOtp, setOtp, sendOtp, sendPhoneNumber } from '../store/otpSlice';

function InputOtp() {
  const history = useHistory();
  const otp = useSelector(selectOtp);
  const dispatch = useDispatch();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setOtp(e.target.value));
  };

  const onSuccess = () => {
    history.push('/welcome');
  };

  const onError = () => {
    alert('OTPが間違っているか有効期限切れです');
  };

  const onSuccessResend = () => {
    alert('再送しました');
  };

  const onClickSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(sendOtp(onSuccess, onError));
  };

  const onClickResend = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(sendPhoneNumber(onSuccessResend));
  };

  return (
    <div>
      <label>ワンタイムパスワード</label>
      <br />
      <input name="otp" onChange={onChange} value={otp} />
      <br />
      <button onClick={onClickSubmit}>送信</button>{' '}
      <button onClick={onClickResend}>再発行</button>
    </div>
  );
}

export default InputOtp;
