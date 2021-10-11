import { Redirect, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";

const Auth2Route = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if(
          localStorage.getItem("authToken") &&
          jwt_decode(localStorage.getItem("authToken")).authLevel1 
        ) {
          return <Component {...props} />
        }
        else if(
          localStorage.getItem("authToken") &&
          jwt_decode(localStorage.getItem("authToken")).authLevel2
        ) {
          return <Redirect to="/authLevel3" />
        }
        else {
          return <Redirect to="/authLevel1" />
        }
      }
      }
    />
  );
};

export default Auth2Route;