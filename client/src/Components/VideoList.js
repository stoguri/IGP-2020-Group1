import React from 'react';
import { makeStyles, List, ListItem, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
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
}))

const VideoList = () => {

    const classes = useStyles();
    return (
        <List className={classes.videoList}>
            <Paper className={classes.videoListItem} elevation={10}>
                <ListItem>
                    Video 2
                </ListItem>
            </Paper>
            <Paper className={classes.videoListItem} elevation={10}>
                <ListItem>
                    Video 3
                </ListItem>
            </Paper>
            <Paper className={classes.videoListItem} elevation={10}>
                <ListItem>
                    Video 4
                </ListItem>
            </Paper>
            <Paper className={classes.videoListItem} elevation={10}>
                <ListItem>
                    Video 5
                </ListItem>
            </Paper>
        </List>
    )
}

export default VideoList;