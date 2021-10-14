import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

import {
  Button,
  CssBaseline,
  Link,
  Grid,
  Box,
  Container,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Textfield from '../FormsUI/Textfield';

import Alert from '@material-ui/lab/Alert';

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

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  formWrapper: {
    marginTop: theme.spacing(4),
  },
}));

const Login = React.memo(() => {
  const classes = useStyles();
  const history = useHistory();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [message, setMessage] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const recaptchaRef = useRef();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/authLevel2");
    }
  }, [history]);

  const INITIAL_FORM_STATE = {
    email: '',
    password: '',
    termsOfService: false
  };
    
  const FORM_VALIDATION = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email.')
      .required('Please provide email address'),
    password: Yup.string()
      .required('Password is required')
      .min(6)
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
        "http://localhost:9997/api/auth/login",
        { 
          email, 
          password, 
          captchaToken 
        },
        config
      );
      setLoading(false);
      setMessage(res.data.data)
      localStorage.setItem("authToken", res.data.token);
      history.push('/authLevel2');
    } catch (error) {
      setError(error.response.data);
      setLoading(false);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5" gutterBottom>
          Sign In
        </Typography>
        <Typography variant="body2" color='textSecondary' gutterBottom>
          secure e-voting platform
        </Typography>
        {
          error &&
          <Alert severity="error">{error}</Alert>
        }
        {
          message &&
          <Alert varinat='outlined' severity="info">{message}</Alert>
        }
        <Grid container>
          <Grid item xs={12}>
            <div className={classes.formWrapper}>
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
                            >
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
                    {
                      loading?
                      <CircularProgress/>
                      :
                      <Button 
                        type='submit'
                        disabled={loading}
                        color='primary'
                        variant='contained'
                        style={{marginBottom: '1em'}}
                      >
                        Login
                      </Button>
                    }
                  </Grid>
                </Grid>
              </Form>
            </Formik>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              size="invisible"
            />
          </div>

      </Grid>
      </Grid>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
})

export default Login;

