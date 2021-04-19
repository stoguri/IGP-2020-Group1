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
        justifyContent: "space-between",
        alignItems: 'center',
        height: '8vh'
    },
    title: {
        fontSize: 'calc(1em + 3vw)'
    },
    button: {
        height: '40%',
        marginRight: '1vw'
    }
});

const LogoutTopbar = () => {

    const { logout, user } = useAuth0()

    const classes = useStyles();
    return (
        <AppBar className={classes.root}>
            <Typography>
                {user.sub}<br />
                {user.email}
            </Typography>
            <Typography className={classes.title} variant='h1'>Traffic Surveillance</Typography>
            <Button className={classes.button} onClick={() => logout({ returnTo: window.location.origin})} variant='contained'>logout</Button>
        </AppBar>          
    );
}

export default LogoutTopbar;