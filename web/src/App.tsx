import React from 'react';
import Router from './routes/router';
import useWebOtp from './hooks/useWebOtp';

function App() {
  useWebOtp();
  return (
    <>
      <h1>Web Otp Demo</h1>
      <Router />
    </>
  );
}

export default App;
