import React from 'react';
import { useHistory } from 'react-router-dom';

function InputOtp() {
  const history = useHistory();
  const onClickSubmit = () => {
    history.push('/welcome');
  };
  return (
    <div>
      <label>ワンタイムパスワード</label>
      <br />
      <input name="otp" />
      <br />
      <button onClick={onClickSubmit}>送信</button> <button>再発行</button>
    </div>
  );
}

export default InputOtp;
