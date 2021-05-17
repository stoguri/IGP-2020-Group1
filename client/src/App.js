import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import HomeView from './Views/HomeView';
import LoginView from './Views/LoginView';
import config from './config.json';
import { io } from 'socket.io-client';

let serverUrl;
if (config.network.server.https) {
    serverUrl = `https://${config.network.server.https.domain}:${config.network.server.https.port}`;
} else {
    serverUrl = `http://${config.network.server.domain}:${config.network.server.http.port}`;
}

function initSocket() {
    const socket = io(serverUrl);
    socket.on("connect", () => {
        console.log("socket connected");
    });

    return socket;
}

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
            <HomeView socket={initSocket()} serverUrl={serverUrl}/>
        </Box>
    );
}
