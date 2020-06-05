import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div>
      <p>ログインに成功しました！</p>
      <Link to="/">トップに戻る</Link>
    </div>
  );
}

export default Welcome;
