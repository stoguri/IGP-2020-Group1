import React, { useEffect, useState } from 'react';
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

    const { getAccessTokenSilently } = useAuth0();
    const serverUrl = `${config.network.server.protocol}://${config.network.server.domain}:${config.network.server.port}`;
    const [vehicleData, setVehicleData] = useState([]);

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.1 },
        { field: 'dirIn', headerName: 'Direction In', flex: 0.45 },
        { field: 'dirOut', headerName: 'Direction Out', flex: 0.45 },
    ];
    
    const getVehicleDataSecurely = async () => {
        try {
            const token = await getAccessTokenSilently({
                audience: config.auth.api.identifier,
                scope: "read:vehicle"
            });

            const response = await fetch(
                `${serverUrl}/api/vehicle`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            return data;

        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(async () => {
        const jsonData = await getVehicleDataSecurely();
        let arrayData = [];
        jsonData.data.forEach((vehicle) => {
            arrayData.push(vehicle);
        });
        setVehicleData(arrayData);
    })

    const classes = useStyles();
    return (
        <Paper className={classes.root} elevation={10}>
            <DataGrid id='datagrid' rows={vehicleData} columns={columns} pageSize={10} />
        </Paper>
    )
}

export default Table;