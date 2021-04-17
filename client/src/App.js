import React from 'react';
import { Router, Switch, Route } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import HomeView from './Views/HomeView.js'
import LoginView from './Views/LoginView.js'



/*
Single Page Application - Dynamically render components into this view from './Components'
*/

const useStyles = makeStyles({
    wrapper: {
        maxHeight: "100vh",
        maxWidth: "100vw"
    }
})

export default function App() {

    const classes = useStyles()
    return (
        <Box className={classes.wrapper}>
            <Switch>
                <Route path='/' component={LoginView} />
                <Route path='/Home' component={HomeView} />
            </Switch>
        </Box>
    );
}
