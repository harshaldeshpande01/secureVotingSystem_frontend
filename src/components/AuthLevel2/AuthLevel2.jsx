import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom';

import {
  Button,
  CssBaseline,
  Link,
  Grid,
  Container,
  Typography,
  CircularProgress
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Textfield from '../FormsUI/Textfield';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import jwt_decode from 'jwt-decode';


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
  // const [message, setMessage] = useState();
  const [play, setPlay] = useState(false);
  const [visible, setVisible] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const at = localStorage.getItem("authToken");

    const renderTime = ({ remainingTime }) => {
      if (remainingTime === 0) {
        setVisible(false);
        setPlay(false);
        return <div className="timer">Timed out</div>;
      }
    
      return (
        <div className="timer">
          <div className="value">{remainingTime}</div>
          <div className="text">seconds</div>
        </div>
      );
    };

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
      // setMessage('OTP sent succesfully');
      // setTimeout(() => {
      //   setMessage("");
      // }, 4000);
      setVisible(true);
      setPlay(true);
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
        setTimeout(() => {
          setError("");
        }, 4000);
      }
    }  
  }

  useEffect(() => {
    sendOTP();
  }, [])

  const handleLogout = () => {
    localStorage.clear();
    history.push('/authLevel2');
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
        history.push("/authLevel3");
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
          setLoading(false);
          setTimeout(() => {
            setError("");
          }, 4000);
        }
      }    
  }

    return (
      <div>
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5" color='textSecondary' gutterBottom>
          2-Step Verification
        </Typography>
        {
          error &&
          <Alert severity="error">{error}</Alert>
        }
        {/* {
          message &&
          <Alert severity="info">{message}</Alert>
        } */}
        <br/>
        <Typography variant="body2" component="p" align="center" gutterBottom>
          Enter OTP Sent to your mobile number XXXXXXXX{jwt_decode(at).phone.substr(8)}
        </Typography> 

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

                  <Grid item xs={12}>
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
            <Grid item xs={12}>
              <Link
                style={{marginBottom: '0.5em'}}
                component="button"
                variant="body2"
                onClick={handleLogout}
              >
                Cancel and go back
              </Link>
            </Grid>
            {
              !visible &&
                <Grid item xs={12}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={sendOTP}
                  >
                    Resend OTP
                  </Link>
                </Grid>
            }

          <div style={{marginTop: '2em'}}>
            <Grid align='center'>
            {
              visible &&
              <CountdownCircleTimer
                isPlaying={play}
                duration={60}
                colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
                onComplete={() => [true, 1000]}
                size={130}
              >
                {renderTime}
              </CountdownCircleTimer>
            } 
            </Grid>
          </div>

      </Grid>
      </Grid> 
      </div>
    </Container>
    </div>
  );
})

export default AuthLevel2;