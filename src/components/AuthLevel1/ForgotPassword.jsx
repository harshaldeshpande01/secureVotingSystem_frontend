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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/authLevel2");
    }
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
  
      if(!email) {
        return setEmailError("Please provide an email");
      }
  
      if(!ValidateEmail(email)) {
        return setEmailError("Email badly formatted");
      }
  
      setEmailError('');

      setLoading(true);
      const config = {
        header: {
          "Content-Type": "application/json",
        },
      };
  
      try {
        const { data } = await axios.post(
          "/api/auth/forgotpassword",
          { email },
          config
        );
        setLoading(false);
        setSuccess(data.data);
      } catch (error) {
        setError(error.response.data.error);
        setEmail("");
        setLoading(false);
        setTimeout(() => {
          setError("");
        }, 5000);
      }
      
      return true;
    }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        {
          error &&
          <Alert severity="error">{error}</Alert>
        }
        {
          success &&
          <Alert severity="success">{success}</Alert>
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
              Submit
            </Button>
          }
          <Grid container>
            <Grid item xs>
              <Link href="/authLevel1" variant="body2">
                Back to Login
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