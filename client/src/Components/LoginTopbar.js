import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, AppBar, makeStyles, Button } from '@material-ui/core';

/*
Application top bar
*/

const useStyles = makeStyles({
    root: {
        backgroundColor: "darkslategrey",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: 'center',
        height: '8vh'
    },
    title: {
        fontSize: 'calc(1em + 3vw)',
        marginRight: '30vw'
    },
    button: {
        height: '40%',
        marginRight: '1vw'
    }
});

const LoginTopbar = () => {

    const { loginWithRedirect, logout } = useAuth0()

    const killAuth0Sessions = () => {
        logout();
        login();
    }

    const login = () => {
        setTimeout(() => { loginWithRedirect() }, 50) // wait 100ms before calling login to ensure that auth0 has time to destroy access tokens
    }

    const classes = useStyles();
    return (
        <AppBar className={classes.root}>
            <Typography className={classes.title} variant='h1'>IGP-2020-Group1</Typography>
            <Button className={classes.button} onClick={() => killAuth0Sessions()} variant='contained'>login</Button>
        </AppBar>
    )
}

export default LoginTopbar;