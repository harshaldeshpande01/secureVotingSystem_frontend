import { Redirect, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";

const OTPRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const token = localStorage.getItem("authToken")
        if(token) {
          const decoded = jwt_decode(token)
          if(decoded.authLevel1 ) {
            return <Component {...props} />
          }
          else if(decoded.authLevel2) {
            return <Redirect to="/" />
          }
        }
        else {
          return <Redirect to="/authLevel1" />
        }
      }
      }
    />
  );
};

export default OTPRoute;