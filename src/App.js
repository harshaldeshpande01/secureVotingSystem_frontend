import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import PrivateAuth2Route from "./PrivateAuth2Route";
import Login from './components/AuthLevel1/Login'; 
import Register from './components/AuthLevel1/Resgister';
import ForgotPassword from './components/AuthLevel1/ForgotPassword'; 
import ResetPassword from './components/AuthLevel1/ResetPassword';
import AuthLevel2 from "./components/AuthLevel2/AuthLevel2";

export default function App() {
  return (
    <Router>
    <div className="app">
      <Switch>
        <PrivateAuth2Route exact path="/authLevel2" component={AuthLevel2} />
        <Route exact path="/authLevel1" component={Login} />
        <Route exact path="/authLevel1/register" component={Register} />
        <Route
          exact
          path="/authLevel1/forgotpassword"
          component={ForgotPassword}
        />
        <Route
          exact
          path="/authLevel1/passwordreset/:resetToken"
          component={ResetPassword}
        />
      </Switch>
    </div>
  </Router>
  );
}