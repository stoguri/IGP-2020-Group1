import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Paper, List, ListItem, Grid } from '@material-ui/core';
import Table from '../Components/Table';
import VideoList from '../Components/VideoList';
import MainVideo from '../Components/MainVideo.js';

/*
Home page text and photo component
*/

const useStyles = makeStyles((theme) => ({
    root: {
        overflowX: 'hidden'
    },
    grid: {
        marginTop: "10vh"
    }
}));

export default function HomeView() {

    const { isAuthenticated } = useAuth0();

    const classes = useStyles();
    return (
        isAuthenticated && (
            <Box className={classes.root}>
                <LogoutTopbar view="HomeView" />
                <Grid container spacing={3} className={classes.grid}>
                    <Grid item xs={7}>
                        <MainVideo stream={1}/>
                    </Grid>
                    <Grid item xs={5}>
                        <Table />
                    </Grid>
                    <Grid item xs={12}>
                        <VideoList />
                    </Grid>
                </Grid>
            </Box>
        )
    );
}
