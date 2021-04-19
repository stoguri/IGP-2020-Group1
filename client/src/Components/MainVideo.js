import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';
 
const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: '2vw',
        height: '55vh'
    }
}));

const MainVideo = (props) => {

    let stream = props.stream;
    console.log(stream);

    const classes = useStyles();
    return (
        <Paper className={classes.root} elevation={10}>
            Large Video
        </Paper>
    )
}

export default MainVideo;