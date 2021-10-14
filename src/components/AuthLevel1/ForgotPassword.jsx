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
  Typography
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

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
    alignItems: 'center',
  },
  formWrapper: {
    marginTop: theme.spacing(4),
  },
}));

const ForgotPassword = React.memo(() => {
  const classes = useStyles();
  const history = useHistory();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [message, setMessage] = useState();
  const recaptchaRef = useRef(null)

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/authLevel2");
    }
  }, [history]);

  const INITIAL_FORM_STATE = {
    email: '',
    termsOfService: false
  };
    
  const FORM_VALIDATION = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email.')
      .required('Required')
    });

  const handleSubmit = async (values) => {
    setLoading(true);
    const { email } = values;
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    const captchaToken = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();
  
    try {
      const res = await axios.post(
        "http://localhost:9997/api/auth/forgotPassword",
        { 
          email,
          captchaToken
        },
        config
      );
      setLoading(false);
      setMessage(res.data.data)
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
          Forgot Password
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
                onSubmit={values => handleSubmit(values)}
              >
                <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Textfield
                      name="email"
                      label="Email"
                    />
                  </Grid>

                <Grid item>
                  <Link href="/authLevel1" variant="body2">
                    {"Go back to login?"}
                  </Link>
                </Grid>

                  <Grid item xs={12} align='right'>
                    <Button 
                      type='submit'
                      disabled={loading}
                      color='primary'
                      variant='contained'
                      style={{marginBottom: '1em'}}
                    >
                      Submit 
                    </Button>
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

export default ForgotPassword;