import React, { useState } from 'react';
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
        justifyContent: "center",
        height: '8vh'
    },
    title: {
        position: 'fixed',
        fontSize: 'calc(1em + 3vw)'
    },
    button: {
        height: '40%',
        marginTop: '1.5%',
        marginLeft: '80%'
    }
});

const LoginTopbar = (props) => {

    const { loginWithRedirect, isAuthenticated } = useAuth0()

    const classes = useStyles();
    return (
        <AppBar className={classes.root}>
            <Typography className={classes.title} variant='h1'>IGP-2020-Group1</Typography>
            <Button className={classes.button} onClick={() => loginWithRedirect()} variant='contained'>login</Button>
        </AppBar>
    )
}

export default LoginTopbar;