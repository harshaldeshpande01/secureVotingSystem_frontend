import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

import {
  CssBaseline,
  Link,
  Grid,
  Box,
  Container,
  Typography,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Textfield from '../FormsUI/Textfield';

// import Alert from '@mui/material/Alert';

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


const Login = React.memo(() => {
  const history = useHistory();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const recaptchaRef = useRef();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/authLevel2");
    }
  }, [history]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const INITIAL_FORM_STATE = {
    email: '',
    password: '',
    termsOfService: false
  };
    
  const FORM_VALIDATION = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email.')
      .required('Please provide email address')
      .max(64),
    password: Yup.string()
      .required('Password is required')
      .min(6)
      .max(64)
    });

  const loginUser = async (values) => {
    setLoading(true);
    const {email, password} = values;
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    const captchaToken = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();
    
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_AUTH_LEVEL1}/login`,
        { 
          email, 
          password, 
          captchaToken 
        },
        config
      );
      setLoading(false);
      localStorage.setItem("authToken", res.data.token);
      history.push('/authLevel2');
    } catch (error) {
      setError(error.response.data);
      setLoading(false);
      setOpen(true);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={{ marginTop: '6em', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Typography component="h1" variant="h5" gutterBottom>
          Sign In
        </Typography>
        <Typography variant="body2" color='textSecondary' style={{marginBottom: '2em'}}>
          secure e-voting platform
        </Typography>

        <Grid container>
          <Grid item xs={12}>
            <div>
              <Formik
                initialValues={{
                  ...INITIAL_FORM_STATE
                }}
                validationSchema={FORM_VALIDATION}
                onSubmit={values => loginUser(values)}
              >
                <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Textfield
                      name="email"
                      label="Email"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Textfield
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      InputProps={{ 
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              size="large">
                              {showPassword ? <Visibility color='primary'/> : <VisibilityOff color='primary'/>}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                <Grid item md={12} xs={12}>
                  <Link href="/authLevel1/forgotPassword" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item md={12} xs={12}>
                  <Typography variant="body2" color='textSecondary'>
                    You can join us now by
                  </Typography>
                  <Link href="/authLevel1/register" variant="body2">
                    {"Creating a account"}
                  </Link>
                </Grid>

                  <Grid item xs={12} align='right'>
                  <LoadingButton
                    type='submit'
                    loading={loading}
                    color='primary'
                    variant='contained'
                    style={{marginBottom: '1em'}}
                  >
                    Login
                  </LoadingButton>
                  </Grid>
                </Grid>
              </Form>
            </Formik>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              size="invisible"
              badge='bottomleft'
            />
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
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%', height: '100%' }}>
          Invalid username or password!
        </Alert>
      </Snackbar>

    </Container>
  );
})

export default Login;

