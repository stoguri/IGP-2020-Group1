import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Card, CardHeader, CardMedia, Grid, List, ListItem, Paper } from '@material-ui/core';
import LogoutTopbar from '../Components/LogoutTopbar';
import Table from '../Components/Table';

/*
Home page text and photo component
*/

const useStyles = makeStyles((theme) => ({
    root: {
        overflowX: 'hidden'
    },
    grid: {
        marginTop: "10vh"
    },
    mainVideo: {
        marginLeft: '2vw',
        height: '55vh'
    },
    videoList: {
        display: 'flex',
        flexDirection: 'row'
    },
    videoListItem: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        width: '20%',
        height: '20vh',
        margin: '0 2vw'
    }
}));

export default function HomeView() {

    const { isAuthenticated } = useAuth0();
    const [videoList, setVideoList] = useState(["id0", "id1", "id2", "id3", "id4"]);
    const date = new Date;

    // Entrance numbers/id must be defined
    const handleVideoClicks = (props) => {
        const currentOrder = videoList;
        const currentMain = videoList[0];
        if (props === '2') {
            currentOrder[0] = currentOrder[1];
            currentOrder[1] = currentMain;
        } else if (props === '3') {
            currentOrder[0] = currentOrder[2];
            currentOrder[2] = currentMain;
        } else if (props === '4') {
            currentOrder[0] = currentOrder[3];
            currentOrder[3] = currentMain;
        } else if (props === '5') {
            currentOrder[0] = currentOrder[4];
            currentOrder[4] = currentMain;
        }
        setVideoList([...currentOrder]);
    }

    const classes = useStyles();
    return (
        isAuthenticated && (
            <Box className={classes.root}>
                <LogoutTopbar view="HomeView" />
                <Grid container spacing={3} className={classes.grid}>
                    <Grid item xs={7}>
                        <Card className={classes.mainVideo} elevation={10}>
                            <CardHeader
                                title={videoList[0]}
                                subheader={"started viewing at: " + date.getHours() + ":" + date.getMinutes()}
                            />
                            <CardMedia

                            />
                        </Card>
                    </Grid>
                    <Grid item xs={5}>
                        <Table camera={videoList[0]}/>
                    </Grid>
                    <Grid item xs={12}>
                        <List className={classes.videoList}>
                            <Paper className={classes.videoListItem} onClick={() => { handleVideoClicks('2') }} elevation={10}>
                                <ListItem>
                                    {videoList[1]}
                                </ListItem>
                            </Paper>
                            <Paper className={classes.videoListItem} onClick={() => { handleVideoClicks('3') }} elevation={10}>
                                <ListItem>
                                    {videoList[2]}
                                </ListItem>
                            </Paper>
                            <Paper className={classes.videoListItem} onClick={() => { handleVideoClicks('4') }} elevation={10}>
                                <ListItem>
                                    {videoList[3]}
                                </ListItem>
                            </Paper>
                            <Paper className={classes.videoListItem} onClick={() => { handleVideoClicks('5') }} elevation={10}>
                                <ListItem>
                                    {videoList[4]}
                                </ListItem>
                            </Paper>
                        </List>
                    </Grid>
                </Grid>
            </Box>
        )
    );
}
