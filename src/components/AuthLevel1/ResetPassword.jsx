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

export default function SignIn({match}) {
  const classes = useStyles();
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirm, setConfirm] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/authLevel2");
    }
  }, [history]);

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if(!password) {
        return setPasswordError("Please provide your password");
      }
  
      if(password.length < 6) {
        return setPasswordError("Minimum 6 characters required");
      }
  
      setPasswordError('');

      if(!confirm) {
        return setConfirmError("Please confirm your password");
      }
  
      if(confirm.length < 6) {
        return setConfirmError("Minimum 6 characters required");
      }

      if(confirm !== password) {
        return setConfirmError("Passwords do not match!")
      }

      setConfirmError('');

      setLoading(true);
      const config = {
        header: {
          "Content-Type": "application/json",
        },
      };

      console.log(match.params);
  
      try {
        const { data } = await axios.put(
          `/api/auth/passwordreset/${match.params.resetToken}`,
          {
            password,
          },
          config
        );
  
        setLoading(false);
        setSuccess(data.data);
      } catch (error) {
        setError(error.response.data.error);
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
          Reset Password
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
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                error = {!!passwordError}
                helperText = {passwordError}
            />
           <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirm password"
                label="Confirm password"
                type="password"
                id="confirm password"
                autoComplete="current-password"
                onChange={(e) => setConfirm(e.target.value)}
                error = {!!confirmError}
                helperText = {confirmError}
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
              Reset
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