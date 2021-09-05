import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from "axios";
import Avatar from '@material-ui/core/Avatar';
import {Button, CircularProgress} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ReCAPTCHA from 'react-google-recaptcha';

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
    marginTop: theme.spacing(8),
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

export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState();
  const recaptchaRef = React.useRef();

  useEffect(() => {
    // async function trial() {
    //   await recaptchaRef.current.executeAsync();
    // }
    if (localStorage.getItem("authToken")) {
      history.push("/authLevel2");
    }
    // trial();
  }, [history]);

    const ValidateEmail = (mail) => {
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
        {
          return true
        }
        return false
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      // console.log('here');
  
      if(!email) {
        return setEmailError("Please provide an email");
      }
  
      if(!ValidateEmail(email)) {
        return setEmailError("Email badly formatted");
      }
  
      setEmailError('');
  
      if(!password) {
        return setPasswordError("Please provide your password");
      }
  
      if(password.length < 6) {
        return setPasswordError("Minimum 6 characters required");
      }
  
      setPasswordError('');

      const token = await recaptchaRef.current.executeAsync();

      setLoading(true);
      const config = {
        header: {
          "Content-Type": "application/json",
        },
      };
  
      try {
        const { data } = await axios.post(
          "/api/auth/login",
          { email, password },
          config
        );
  
        localStorage.setItem("authToken", data.token);
        setLoading(false);
        history.push("/authLevel2");
      } catch (error) {
        setError(error.response.data.error);
        setLoading(false);
        setTimeout(() => {
          setError("");
        }, 5000);
      }
      
      return true;
    }

  // const loginHandler = async (e) => {
  //   e.preventDefault();

  //   const config = {
  //     header: {
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   try {
  //     const { data } = await axios.post(
  //       "/api/auth/login",
  //       { email, password },
  //       config
  //     );

  //     localStorage.setItem("authToken", data.token);

  //     history.push("/authLevel2");
  //   } catch (error) {
  //     setError(error.response.data.error);
  //     setTimeout(() => {
  //       setError("");
  //     }, 5000);
  //   }
  // };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {
          error &&
          <Alert severity="error">{error}</Alert>
        }
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            error = {!!emailError}
            helperText = {emailError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            error = {!!passwordError}
            helperText = {passwordError}
          />
          {/* <Grid container align="center">
              <Grid item md={6}> */}
              <ReCAPTCHA 
              size='invisible'
              sitekey="6Lc_3EMcAAAAAK88Hn5XvO_60q6MfW29yT1BMdad"
              ref={recaptchaRef}
            />
              {/* </Grid>
            </Grid> */}

          {loading ? 
            <Grid container align="center">
              <Grid item xs>
                <CircularProgress/>
              </Grid>
            </Grid>
          :
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
          }
          <Grid container>
            <Grid item xs>
              <Link href="/authLevel1/forgotPassword" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/authLevel1/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}