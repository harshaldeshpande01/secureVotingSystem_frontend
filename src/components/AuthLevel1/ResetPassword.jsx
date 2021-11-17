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
} from '@mui/material';

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Textfield from '../FormsUI/Textfield';

import Alert from '@mui/material/Alert';

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

const ResetPassword = React.memo(({match}) => {
  const history = useHistory();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const recaptchaRef = useRef(null)

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/authLevel2");
    }
  }, [history]);

  const INITIAL_FORM_STATE = {
    password: ''
  };
    
  const FORM_VALIDATION = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(6)
      .max(64)
  });

    const handleSubmit = async (values) => {
      const {password} = values;

      setLoading(true);
      
      const config = {
        header: {
          "Content-Type": "application/json",
        },
      };

    const captchaToken = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();
  
      try {
        const { data } = await axios.put(
          `${process.env.REACT_APP_AUTH_LEVEL1}/passwordreset/${match.params.resetToken}`,
          {
            password,
            captchaToken
          },
          config
        );
        setLoading(false);
        setSuccess(data.data);
        setTimeout(() => {
          setSuccess("");
        }, 4000);
      } catch (error) {
        setError(error.response.data);
        setLoading(false);
        setTimeout(() => {
          setError("");
        }, 4000);
      }
      
      return true;
    }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={{marginTop: '6em', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Typography component="h1" variant="h5" gutterBottom>
          Reset Password
        </Typography>
        <Typography variant="body2" color='textSecondary' gutterBottom>
          secure e-voting platform
        </Typography>
        {
          error &&
          <Alert severity="error">{error}</Alert>
        }
        {
          success &&
          <Alert severity="success">{success}</Alert>
        }
        <Grid container>
          <Grid item xs={12}>
            <div style={{ marginTop: '2em'}}>
              <Formik
                initialValues={{
                  ...INITIAL_FORM_STATE
                }}
                validationSchema={FORM_VALIDATION}
                onSubmit={values => handleSubmit(values)}
              >
                <Form>
                <Grid container spacing={2}>
                  
                <Grid item xs={12}>
                    <Textfield
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      InputProps={{ // <-- This is where the toggle button is added.
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

                <Grid item>
                  <Link href="/authLevel1" variant="body2">
                    {"Go back to login?"}
                  </Link>
                </Grid>

                  <Grid item xs={12} align='right'>
                    {
                      loading?
                      <CircularProgress/>
                      :
                      <Button 
                        type='submit'
                        color='primary'
                        variant='contained'
                      >
                        Submit 
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
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
})

export default ResetPassword;