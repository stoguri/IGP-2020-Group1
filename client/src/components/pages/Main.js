import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import './Main.css';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}));


function Main() {
  const classes = useStyles();

  return (
    <main className="App-header">
      <Container max-width='sm'>
        <Container max-width='sm'>
          Main Video
        </Container>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={8}>
            <Paper className={classes.paper}>xs=8</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>xs=4</Paper>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}

export default Main;