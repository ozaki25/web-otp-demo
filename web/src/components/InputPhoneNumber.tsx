import React from 'react';
import { useHistory } from 'react-router-dom';

function InputPhoneNumber() {
  const history = useHistory();
  const onClickSubmit = () => {
    history.push('/otp');
  };
  return (
    <div>
      <label>電話番号</label>
      <br />
      <input name="phone" />
      <br />
      <button onClick={onClickSubmit}>送信</button>
    </div>
  );
}

export default InputPhoneNumber;
