import React, { ChangeEvent, MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { selectOtp, setOtp, sendOtp } from '../store/otpSlice';
import { useSelector, useDispatch } from 'react-redux';

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

  const onClickSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(sendOtp(onSuccess, onError));
  };

  return (
    <div>
      <label>ワンタイムパスワード</label>
      <br />
      <input name="otp" onChange={onChange} value={otp} />
      <br />
      <button onClick={onClickSubmit}>送信</button> <button>再発行</button>
    </div>
  );
}

export default InputOtp;
