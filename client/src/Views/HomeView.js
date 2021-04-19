import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Paper, List, ListItem, Grid } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid';
import LogoutTopbar from '../Components/LogoutTopbar.js'

/*
Home page text and photo component
*/

export default function HomeView() {

    const useStyles = makeStyles((theme) => ({
        root: {
            overflowX: 'hidden'
        },
        grid: {
            marginTop: "10vh"
        },
        largeVideo: {
            marginLeft: '2vw',
            height: '55vh'
        },
        dataTable: {
            marginRight: '2vw',
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

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.1 },
        { field: 'dirIn', headerName: 'Direction In', flex: 0.45 },
        { field: 'dirOut', headerName: 'Direction Out', flex: 0.45 },
    ];

    const rows = [
        { id: '1', dirIn: 'Camera 2', dirOut: 'camera 4' },
        { id: '2', dirIn: 'Camera 2', dirOut: 'camera 4' },
        { id: '3', dirIn: 'Camera 2', dirOut: 'camera 4' },
        { id: '4', dirIn: 'Camera 2', dirOut: 'camera 4' },
        { id: '5', dirIn: 'Camera 2', dirOut: 'camera 4' },
        { id: '6', dirIn: 'Camera 2', dirOut: 'camera 4' },
        { id: '7', dirIn: 'Camera 2', dirOut: 'camera 4' },
        { id: '8', dirIn: 'Camera 2', dirOut: 'camera 4' },
    ];

    const classes = useStyles();
    return (
        <Box className={classes.root}>
            <LogoutTopbar />
            <Grid container spacing={3} className={classes.grid}>
                <Grid item xs={7}>
                    <Paper className={classes.largeVideo} elevation={10}>
                        Large Video
                    </Paper>
                </Grid>
                <Grid item xs={5}>
                    <Paper className={classes.dataTable} elevation={10}>
                        <DataGrid id='datagrid' rows={rows} columns={columns} pageSize={10} />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
            </Grid>
        </Box>
    );
}
