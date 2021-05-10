import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography } from '@material-ui/core'
import HomeView from './Views/HomeView'
import LoginView from './Views/LoginView'



/*
Single Page Application - Dynamically render components into this view from './Components'
*/

const useStyles = makeStyles({
    wrapper: {
        maxHeight: "100vh",
        maxWidth: "100vw",
        overflowX: 'hidden'
    },
    loading: {
        display: 'flex',
        height: '100vh',
        justifyContent: 'center'
    }
})

export default function App(props) {

    const { isLoading } = useAuth0();
    const classes = useStyles()

    if (isLoading) {
        return (
            <Box className={classes.loading} alignItems='center'>
                <Typography variant='h1' component='h1'>
                    loading...
                </Typography>
            </Box>
        )
    }
    return (
        <Box className={classes.wrapper}>
            <LoginView />
            <HomeView/>
        </Box>
    );
}
