import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom';

import {
  Button,
  CssBaseline,
  Link,
  Grid,
  Box,
  Container,
  Typography,
  CircularProgress
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Textfield from '../FormsUI/Textfield';

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

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const AuthLevel2 = React.memo(() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const classes = useStyles();
  const history = useHistory();


  useEffect(() => {
    const sendOTP = async() => {
      let token = localStorage.getItem("authToken");
      let hashOTP = localStorage.getItem("hashOTP");
      if(hashOTP) {
        return;
      }
  
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
          "http://localhost:9996/sendOTP",
          { phone: temp },
          config
        );
        localStorage.setItem("hashOTP", res.data.hash);
        setError('');
      } catch (error) {
        console.log(error);
        if(error.response.status === 401) {
          alert("Your session has expired. Please login again to continue"); 
          localStorage.removeItem("authToken");
          window.location.href = "http://localhost:3000/authLevel1";
        }
        else {
          setError(error.response.data.error);
          setLoading(false);
        }
      }  
    }
    sendOTP();
  }, [])

  // useEffect(() => {
  //   let hashOTP = localStorage.getItem("hashOTP");
  //   setHash(hashOTP);
  // }, []);

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
          "http://localhost:9996/verifyOTP",
          { 
            phone: temp, 
            hash, 
            otp 
          },
          config
        );
        localStorage.removeItem("authToken");
        localStorage.setItem("authToken", res.data.accessToken);
        setLoading(false);
        localStorage.removeItem("hashOTP");
        history.push("/authLevel3");
      } catch (error) {
        console.log(error);
        if(error.response.status === 401) {
          alert("Your session has expired. Please login again to continue"); 
          localStorage.clear();
          window.location.href = "http://localhost:3000/authLevel1";
        }
        else if(error.response.status === 504) {
          alert('OTP Timeout out! Please try again later');
          localStorage.clear();
          window.location.href = "http://localhost:3000/authLevel1";
        }
        else {
        setError(error.response.data.error);
        setLoading(false);
        }
      }    
  }

    return (
      <div>
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5" color='textSecondary' gutterBottom>
          3-Step Verification
        </Typography>
        <br/>
        <Typography variant="body2" component='p'>
          Please enter 6-digit verification code sen't to your registered mobile number to continue
        </Typography>
        {
          error &&
          <Alert severity="error">{error}</Alert>
        }
          <Grid container>
          <Grid item xs={12}>
            <div className={classes.formWrapper}>
              <Formik
                initialValues={{
                  ...INITIAL_FORM_STATE
                }}
                validationSchema={FORM_VALIDATION}
                onSubmit={values => verifyOTP(values)}
              >
                <Form className={classes.form}>
                <Grid container spacing={2}>

                  <Grid item xs={12}>
                    <Textfield
                      name="otp"
                      label="Enter OTP"
                    />
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
                        style={{marginBottom: '1em'}}
                        fullWidth
                      >
                        Verify OTP
                      </Button>
                    }
                  </Grid>
                </Grid>
              </Form>
            </Formik>
          </div>

      </Grid>
      </Grid>  
       
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
    </div>
  );
})

export default AuthLevel2;