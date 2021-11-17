import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";

import {
  CssBaseline,
  Link,
  Box,
  Container,
  Typography,
  CircularProgress
} from '@mui/material';

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

const Confirm = React.memo(({match}) => {
  const history = useHistory();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState();

  const confirmEmail = async() => {
    setLoading(true);
    const config = {
        header: {
          "Content-Type": "application/json",
        },
    };
    try {
        const { data } = await axios.put(
          `${process.env.REACT_APP_AUTH_LEVEL1}/confirmation/${match.params.token}`,
          {},
          config
        );
        setLoading(false);
        setSuccess(data.data);
      } catch (error) {
        setError(error.response.data);
        setLoading(false);
      }
  }

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/authLevel2");
    }    
  }, [history]);

  useEffect(() => {
    confirmEmail();
  }, []);


  return (
    <>
      {
        loading?
            <div style={{position:"fixed",display:"flex",justifyContent:"center",alignItems:"center",width:'100%',height:'100%',zIndex:999999}}> 
                <CircularProgress/> 
            </div>
        :
            <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div style={{marginTop: '6em', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {
                    error &&
                    <Typography component="h1" variant="h5" gutterBottom>
                        Something wen't wrong &#x1F915;
                    </Typography>
                }
                {
                    success &&
                    <>
                        <Typography component="h1" variant="h5" gutterBottom>
                            Email verified succesfully &#x1F389;
                        </Typography>
                        <Link href="/authLevel1" variant="body2">
                            {"Login to access your account"}
                        </Link>
                    </>
                }
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
            </Container>
        }
      </>
  );
})

export default Confirm;