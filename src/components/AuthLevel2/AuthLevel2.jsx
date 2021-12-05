import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom';

import {
  CssBaseline,
  Link,
  Grid,
  Container,
  Typography,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// import Countdown from 'react-countdown';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Textfield from '../FormsUI/Textfield'
import jwt_decode from 'jwt-decode';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Secure Voting System
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const AuthLevel2 = React.memo(() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const at = localStorage.getItem("authToken");

  // const renderer = ({ hours, minutes, seconds, completed }) => {
  //   return <span>00:{seconds}</span>
  // }

  const sendOTP = async() => {
    let token = localStorage.getItem("authToken");

    let temp = jwt_decode(token).phone;
    if(temp[0] === '+') {
      temp = temp.substring(1);
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_AUTH_LEVEL2}/sendOTP`,
        { phone: temp },
        config
      );
      localStorage.setItem("hashOTP", res.data.hash);
      setOpen(true);
      setError('');
    } catch (error) {
      if(error.response.status === 401) {
        alert("Your session has expired. Please login again to continue"); 
        localStorage.clear();
        window.location.href = "http://localhost:3000/authLevel1";
      }
      if(error.response.status === 429) {
        alert("Too many attempts!! Try again later"); 
        localStorage.clear();
        window.location.href = "http://localhost:3000/authLevel1";
      }
      else {
        setError(error.response.data);
      }
    }  
  }

  useEffect(() => {
    sendOTP();
  }, [])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    history.push('/authLevel1');
  }

  const INITIAL_FORM_STATE = {
    otp: ''
  };
    
  const FORM_VALIDATION = Yup.object().shape({
    otp: Yup.string()
    .required('Please provide OTP')
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(6, 'Must be exactly 6 digits')
    .max(6, 'Must be exactly 6 digits')
  });

  const verifyOTP = async (values) => {
      let token = localStorage.getItem("authToken");
      let hash = localStorage.getItem("hashOTP");
      const {otp} = values;
      let temp = jwt_decode(token).phone;
      if(temp[0] === '+') {
        temp = temp.substring(1);
      }
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      };

      try {
        const res  = await axios.post(
          `${process.env.REACT_APP_AUTH_LEVEL2}/verifyOTP`,
          { 
            phone: temp, 
            hash, 
            otp 
          },
          config
        );
        localStorage.removeItem("authToken");
        localStorage.setItem("authToken", res.data.accessToken);
        localStorage.removeItem("hashOTP");
        history.push("/");
      } catch (error) {
        if(error.response.status === 401) {
          alert("Your session has expired. Please login again to continue"); 
          localStorage.clear();
          window.location.href = "http://localhost:3000/authLevel1";
        }
        else if(error.response.status === 504) {
          setError('OTP timed out! Please resend and try again');
          setLoading(false);
          setTimeout(() => {
            setError("");
          }, 4000);
        }
        else if(error.response.status === 429) {
          alert("Too many verify attempts!! Try again later"); 
          localStorage.clear();
          window.location.href = "http://localhost:3000/authLevel1";
        }
        else {
          setError(error.response.data);
          setOpen(true);
          setLoading(false);
        }
      }    
  }

    return (
      <div>
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={{ marginTop: '6em', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Typography component="h1" variant="h5" color='textSecondary' gutterBottom>
          2-Step Verification
        </Typography>
        
        <Typography variant="body2" component="p" align="center" gutterBottom>
          Enter the 6-digit verification code sent to your registered number XXXXXXXX{jwt_decode(at).phone.substr(8)}
        </Typography> 

          <Grid container>
          <Grid item xs={12}>
            <div style={{marginTop: '2em'}}>
              <Formik
                initialValues={{
                  ...INITIAL_FORM_STATE
                }}
                validationSchema={FORM_VALIDATION}
                onSubmit={values => verifyOTP(values)}
              >
                <Form style={{marginTop: '2em'}}>
                <Grid container spacing={2}>

                  <Grid item xs={12}>
                    <Textfield
                      name="otp"
                      label="Enter OTP"
                    />
                  </Grid>

                  <Grid item md={12} xs={12}>
                      <LoadingButton 
                        type='submit'
                        color='primary'
                        variant='contained'
                        loading={loading}
                        fullWidth
                      >
                        Verify
                      </LoadingButton>
                  </Grid>

                  {/* <Grid item xs={12} align='right'>
                    <Countdown 
                      date={Date.now() + 59999} 
                      renderer={renderer}
                    />
                  </Grid> */}

                </Grid>
              </Form>
            </Formik>
            <Grid item md={12} xs={12}>
              <Typography variant="body2" color='textSecondary' style={{marginTop: '1em'}}>
                Didn't recieve OTP?
              </Typography>
              <Link
                component="button"
                variant="body2"
                onClick={sendOTP}
              >
                Resend now
              </Link>
            </Grid>
                  <Grid item xs={12}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleLogout}
                    style={{marginTop: '1em'}}
                  >
                    Cancel and go back
                  </Link>
                  </Grid>
            </div>
      </Grid>
      </Grid> 
      </div>

      <Box mt={5}>
        <Copyright />
      </Box>

      <Snackbar 
        open={open} 
        autoHideDuration={6000} 
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
      >
        {
          error?
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%', height: '100%' }}>
            {error}
          </Alert>
          :
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%', height: '100%' }}>
            OTP sent sucsessfully
          </Alert>
        }
      </Snackbar>

    </Container>
    </div>
  );
})

export default AuthLevel2;