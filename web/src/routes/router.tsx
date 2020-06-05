import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import InputPhoneNumber from '../components/InputPhoneNumber';
import InputOtp from '../components/InputOtp';
import Welcome from '../components/Welcome';

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <>
          <Route path="/" exact>
            <InputPhoneNumber />
          </Route>
          <Route path="/otp" exact>
            <InputOtp />
          </Route>
          <Route path="/welcome" exact>
            <Welcome />
          </Route>
        </>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
