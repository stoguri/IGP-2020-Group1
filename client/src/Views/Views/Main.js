import React from 'react';
import Box from '@material-ui/core/Box'
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
      <Box id='main-grid'>
        <Box id='upper-grid'>
          <Box id='large-video-wrapper'>
            Large Video
          </Box>
          <Box id='main-data-table'>
            <DataGrid id='datagrid' rows={rows} columns={columns} pageSize={10} />
          </Box>
        </Box>
        <Box id='lower-grid'>
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
        </Box>
      </Box>
    </main>
  );
}

export default Main;