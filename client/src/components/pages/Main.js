import React from 'react';
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { DataGrid } from '@material-ui/data-grid';
import './Main.css';

function Main() {

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'dirIn', headerName: 'Direction In', width: 130 },
    { field: 'dirOut', headerName: 'Direction Out', width: 130 },
  ];

  const rows = [
    {id: '1', dirIn: 'Camera 2', dirOut: 'camera 4'},
    {id: '2', dirIn: 'Camera 2', dirOut: 'camera 4'},
    {id: '3', dirIn: 'Camera 2', dirOut: 'camera 4'},
    {id: '4', dirIn: 'Camera 2', dirOut: 'camera 4'},
    {id: '5', dirIn: 'Camera 2', dirOut: 'camera 4'},
    {id: '6', dirIn: 'Camera 2', dirOut: 'camera 4'},
    {id: '7', dirIn: 'Camera 2', dirOut: 'camera 4'},
    {id: '8', dirIn: 'Camera 2', dirOut: 'camera 4'},
  ];

  return (
    <main className="App-header">
      <Container id='main-grid'>
        <Container id='upper-grid'>
          <Container id='large-video-wrapper'>
            Large Video
          </Container>
          <Container id='main-data-table'>
            <DataGrid id='datagrid' rows={rows} columns={columns} pageSize={10} />
          </Container>
        </Container>
        <Container id='lower-grid'>
          <List id='video-sub-list'>
            <ListItem className='video-list-item'>
              Video 2
            </ListItem>
            <ListItem className='video-list-item'>
              Video 3
            </ListItem>
            <ListItem className='video-list-item'>
              Video 4
            </ListItem>
            <ListItem className='video-list-item'>
              Video 5
            </ListItem>
          </List>
        </Container>
      </Container>
    </main>
  );
}

export default Main;