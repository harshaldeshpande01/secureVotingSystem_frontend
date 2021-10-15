import React from 'react'
import {
    Link,
    Typography,
    Box
  } from '@material-ui/core';

const PageNotFound = () => {
    return (
        <Box mt={5}>
            <Typography align='center'> 
                404 page not found
            </Typography>
            <Typography align='center'>
            <Link align='center' href="/authLevel1" variant="body2">
                Back to home
            </Link>
            </Typography> 
        </Box>
    )
}

export default PageNotFound