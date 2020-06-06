import React from 'react';
import { Provider } from 'react-redux';

import Router from './routes/router';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <h1>Web Otp Demo</h1>
      <Router />
    </Provider>
  );
}

export default App;
