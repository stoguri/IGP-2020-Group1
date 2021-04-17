import React, { useState } from 'react';
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
        height: '9%'
    },
    title: {
        position: 'fixed'
    },
    button: {
        height: '40%',
        marginTop: '1.5%',
        marginLeft: '80%'
    }
});

async function LoginLogout(view) {
    if (view === "Login") {
        const response = await fetch('http://localhost:8080/auth/login/auth0');
        if (!response.ok) {
            alert('Error logging in. Please try again')
        }
    } else {
        const response = await fetch('http://localhost:8080/auth/logout');
        if (!response.ok) {
            alert('Error logging ypu out. Please try again')
        }
    }
}

export default function Topbar(props) {

    let header;
    let button;

    if (props.view === 'LoginView') {
        header = "IGP-2020-Group1";
        button = "Login";
    } else {
        header = "Traffic Surveillance";
        button = "Logout";
    }

    const classes = useStyles();
    return (
        <AppBar className={classes.root}>
            <Typography className={classes.title} variant='h1'>{header}</Typography>
            <Button className={classes.button} onClick={LoginLogout(button)} variant='contained'>{button}</Button>
        </AppBar>          
    );
}