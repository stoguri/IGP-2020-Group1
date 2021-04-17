import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Paper } from '@material-ui/core'
import Topbar from '../Components/Topbar.js'

/*
Home page text and photo component
*/

function Welcome() {

    const useStyles = makeStyles({
        wrapper: {

        }
    });

    const classes = useStyles();
    return (
        <Box className={classes.wrapper}>
            <Topbar view='LoginView'/>
            <Typography variant='h3' component='h2'>
                Please login using the button above to view the traffic Surveillance system.
            </Typography>
        </Box>
    );
}

export default Welcome;
