import React, {Suspense} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { CircularProgress } from "@mui/material";

import OTPRoute from "./routes/OTPRoute";
import HomeRoute from "./routes/HomeRoute";

const Login = React.lazy(() => import('./components/AuthLevel1/Login'));
const Register = React.lazy(() => import('./components/AuthLevel1/Register'));
const Confirm = React.lazy(() => import('./components/AuthLevel1/Confirm'));
const ForgotPassword = React.lazy(() => import('./components/AuthLevel1/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./components/AuthLevel1/ResetPassword'));
const AuthLevel2 = React.lazy(() => import('./components/AuthLevel2/AuthLevel2'));
const Dashboard = React.lazy(() => import('./components/Voting/Dashboard'));
const PageNotFound = React.lazy(() => import('./components/404/404'));

export default function App() {
  return (
    <Router>
    <div className="app">
      <Suspense 
        fallback={<div style={{position:"fixed",display:"flex",justifyContent:"center",alignItems:"center",width:'100%',height:'100%',zIndex:999999}}> <CircularProgress/> </div>}
      >
        <Switch>
          <Route exact path="/authLevel1" component={Login} />
          <Route exact path="/authLevel1/register" component={Register} />
          <Route exact path="/authLevel1/confirmation/:token" component={Confirm} />
          <Route exact path="/authLevel1/forgotpassword" component={ForgotPassword}/>
          <Route exact path="/authLevel1/passwordreset/:resetToken" component={ResetPassword}/>
          {/* <OTPRoute exact path="/authLevel2" component={AuthLevel2} /> */}
          <Route exact path="/authLevel2" component={AuthLevel2} />
          <Route exact path="/" component={Dashboard} />
          {/* <HomeRoute exact path="/" component={Dashboard} /> */}
          <Route component={PageNotFound} />
        </Switch>
      </Suspense>
    </div>
  </Router>
  );
}