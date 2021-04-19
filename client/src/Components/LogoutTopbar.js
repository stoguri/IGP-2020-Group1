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

const LogoutTopbar = () => {

    const { logout, user } = useAuth0()

    const classes = useStyles();
    return (
        <AppBar className={classes.root}>
            <Typography className={classes.title} variant='h1'>Traffic Surveillance</Typography>
            <img src={user.picture} />
            <p>{user.sub}</p>
            <Button className={classes.button} onClick={() => logout({ returnTo: window.location.origin})} variant='contained'>logout</Button>
        </AppBar>          
    );
}

export default LogoutTopbar;