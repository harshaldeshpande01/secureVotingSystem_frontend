import React, {Suspense} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

import Auth2Route from "./PrivateRoutes";
import Auth3Route from "./PrivateRoute2";

const Login = React.lazy(() => import('./components/AuthLevel1/Login'));
const Register = React.lazy(() => import('./components/AuthLevel1/Register'));
const ForgotPassword = React.lazy(() => import('./components/AuthLevel1/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./components/AuthLevel1/ResetPassword'));
const AuthLevel2 = React.lazy(() => import('./components/AuthLevel2/AuthLevel2'));
const AuthLevel3 = React.lazy(() => import('./components/AuthLevel3/AuthLevel3'));

export default function App() {
  return (
    <Router>
    <div className="app">
      <Suspense 
        fallback={<div style={{position:"fixed",display:"flex",justifyContent:"center",alignItems:"center",width:'100%',height:'100%',zIndex:999999}}> <CircularProgress/> </div>}
      >
        <Switch>
          <Route exact path="/authLevel1" component={Login} />
          <Auth2Route exact path="/authLevel2" component={AuthLevel2} />
          <Auth3Route exact path="/authLevel3" component={AuthLevel3} />
          <Route exact path="/authLevel1/register" component={Register} />
          <Route exact path="/authLevel1/forgotpassword" component={ForgotPassword}/>
          <Route exact path="/authLevel1/passwordreset/:resetToken" component={ResetPassword}/>
        </Switch>

      </Suspense>
    </div>
  </Router>
  );
}