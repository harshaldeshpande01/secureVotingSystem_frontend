import { Redirect, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";

const HomeRoute = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={(props) => {
          if(
            localStorage.getItem("authToken") &&
            jwt_decode(localStorage.getItem("authToken")).authLevel2 
          ) {
            return <Component {...props} />
          }
          else {
            return <Redirect to="/authLevel2" />
          }
        }
        }
      />
    );
};

export default HomeRoute;