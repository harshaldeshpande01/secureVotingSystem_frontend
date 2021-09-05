import { useState, useEffect } from "react";
import { useHistory, Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import jwt_decode from "jwt-decode";
import { Typography } from "@material-ui/core";

const AuthLevel2 = () => {
  const [user, setUser] = useState("");
  const [otp, setOtp] = useState();
  const history = useHistory();

  useEffect(() => {
      let token = localStorage.getItem("authToken");
      let decoded = jwt_decode(token);
      if(decoded.authLevel1) {
        if (decoded.exp < Date.now() / 1000) {
          localStorage.removeItem("authToken");
          // history.push('/authLevel1');
        }
        setUser(decoded);
        //generate encrypt and send otp
      }
  }, []);

  // validate otp
  // if valid then delete current token, get new token and redirect

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    history.push('/authLevel1');
  }

    return (
      <div>
        <Typography>
            {
            user &&
            user.email
            }
        </Typography>
        <br/>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
  );
};

export default AuthLevel2;
