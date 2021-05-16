import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Card, CardHeader, CardMedia, Grid, List, ListItem, Paper } from '@material-ui/core';
import LogoutTopbar from '../Components/LogoutTopbar';
import { Table } from '../Components/Table';
const flvjs = window.flvjs;

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
    },
    videoItem: {
        height: "-webkit-fill-available",
        width: "-webkit-fill-available",
        float: "left",
        backgroundColor: "black"
    }
}));

let player;
export default function HomeView() {

    const { isAuthenticated } = useAuth0();

    const [videoList, setVideoList] = useState(["id0", "id1", "id2", "id3", "id4"]);

    const [isLoaded, setIsLoaded] = useState(false);

    const date = new Date();

    // Entrance numbers/id must be defined
    const handleVideoClicks = (pos) => {
        const newVideoList = [...videoList];

        // swap the clicked videoId with the main videoId
        const currentMain = newVideoList[0];
        newVideoList[0] = newVideoList[pos];
        newVideoList[pos] = currentMain;

        /*
            when the video elements are swapped, naturally the video.id attributes
            swap with the videos, meaning the position of the on-screen video 
            no longer corresponds to the video.id (aka idx)
            
            to access the correct idx
            - the video position provided onclick is used to obtain the first videoId
            - the first videoId is used to obtain the first idx
            - the main videoId is used to obtain the second idx 
        */
        swapVideos(parseInt(videoList[pos].match(/\d/g)[0]), parseInt(currentMain.match(/\d/g)[0]))
        setVideoList(newVideoList);
    }

    function swapVideos(idx1, idx2) {
        const video1 = document.getElementById('videoStream' + idx1);
        const video2 = document.getElementById('videoStream' + idx2);

        const tmp = document.createElement('div');
        video1.parentElement.insertBefore(tmp, video1);
        video2.parentElement.insertBefore(video1, video2);
        tmp.parentElement.insertBefore(video2, tmp);
        tmp.remove();
    }

    function updateMainStream() {
        if (flvjs.isSupported()) {
            if (player) {
                player.destroy();
            }

            const videoElement = document.getElementById('mainVideo');
            player = flvjs.createPlayer({
                type: 'flv',
                url: `http://localhost:8000/live/${videoList[0]}.flv`
            });
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
        }
    }

    function startLiveStreams() {
        if (flvjs.isSupported()) {
            videoList.slice(0, 4).map((videoId, idx) => {
                const videoElement = document.getElementById('videoStream' + idx);
                player = flvjs.createPlayer({
                    type: 'flv',
                    url: `http://localhost:8000/live/${videoId}.flv`
                });
                player.attachMediaElement(videoElement);
                player.load();
                player.play();
            })
        }
    }

    function videoElement(idx) {
        /* 
            why use idx instead of videoId in the video.id attribute?

            using videoId will cause the video.id attribute to update
            during useEffect which is unwanted behaviour - the video ids 
            must stay fixed for the video swapping
        */
        return <video id={"videoStream" + idx} className={classes.videoItem}></video>
    }

    function listSubVideos() {
        return videoList.slice(1, 4).map((videoId, _idx) => {
            // increment to correct video index
            const idx = _idx+1;

            return (
                <Paper key={idx} className={classes.videoListItem}
                    onClick={() => { handleVideoClicks(idx) }} elevation={10}
                >
                    <ListItem>{videoId}</ListItem>
                    <ListItem style={{ height: "17vh" }}>
                        {videoElement(idx)}
                    </ListItem>
                </Paper>
            )
        });
    }


    useEffect(() => {
        // Update the document title using the browser API
        if (isAuthenticated) {
            if (!isLoaded) {
                startLiveStreams();
                setIsLoaded(true);
            }

        }
    });

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
                            <CardMedia style={{ height: "40vh" }}>
                                {videoElement(0)}
                            </CardMedia>
                        </Card>
                    </Grid>
                    <Grid item xs={5}>
                        <Table camera={videoList[0]} />
                    </Grid>
                    <Grid item xs={12}>
                        <List className={classes.videoList}>
                            {listSubVideos()}
                        </List>
                    </Grid>
                </Grid>
            </Box>
        )
    );
}
