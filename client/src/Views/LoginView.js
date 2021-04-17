import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Paper } from '@material-ui/core'
import Topbar from '../Components/Topbar.js'

/*
Home page text and photo component
*/

export default function LoginView() {

    const useStyles = makeStyles({
        root: {
            width: "100%",
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
        },
        wrapper: {
            display: "flex",
            justifyContent: "center"
        }, 
        text: {
            marginTop: "20%"
        }
    });

    const classes = useStyles();
    return (
        <Box className={classes.root}>
            <Topbar view='LoginView'/>
            <Box className={classes.wrapper}>
                <Typography className={classes.text} variant='h3' component='h2'>
                    Please login using the button above to view the Traffic Surveillance system.
                </Typography>
            </Box>
        </Box>
    );
}

