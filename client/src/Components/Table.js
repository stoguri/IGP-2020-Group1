import React, {useEffect} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { makeStyles, Paper } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import config from '../config.json';
 
const useStyles = makeStyles((theme) => ({
    root: {
        marginRight: '2vw',
        height: '55vh'
    }
}));

const Table = () => {

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

    const { getAccessTokenSilently } = useAuth0();
    const serverUrl = `${config.network.server.protocol}://${config.network.server.domain}:${config.network.server.port}`; 
    let vehicleData;
    const getVehicleDataSecurely = async () => {
        console.log('hit')
        try {
            const token = await getAccessTokenSilently();

            const response = await fetch(
                `${serverUrl}/api/vehicle`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            vehicleData = await response.json();

            console.log(JSON.stringify(vehicleData));

        } catch (error) {
            alert(error.message);
        }
    };
    
    useEffect(async () => {
        getVehicleDataSecurely();
    })

    const classes = useStyles();
    return (
        <Paper className={classes.root} elevation={10}>
            <DataGrid id='datagrid' rows={rows} columns={columns} pageSize={10} />
        </Paper>
    )
}

export default Table;