import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { makeStyles, Paper } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import config from '../config.json';

const useStyles = makeStyles((theme) => ({
    root: {
        marginRight: '2vw',
        height: '55vh'
    },
    grid: {

    }
}));

const Table = (props) => {
    const { getAccessTokenSilently } = useAuth0();

    let serverUrl;
    if (config.network.server.https) {
        serverUrl = `https://${config.network.server.https.domain}:${config.network.server.https.port}`;
    } else {
        serverUrl = `http://${config.network.server.http.domain}:${config.network.server.http.port}`;
    }

    const columns = [
        {field: "id", headerName: 'Field', flex: 0.75, sortable: false},
        {field: "value", headerName: "Value", flex: 0.25, sortable: false}
    ]

    const [vehicleData, setVehicleData] = useState([]);

    /**
     * Gets the vehicle data based on the current junction in view
     * @param {integer} junction_id 
     * @returns {json} vehicle data
     */
    async function getVehicleDataSecurely(junction_id) {
        console.log(junction_id)
        try {
            const token = await getAccessTokenSilently({
                audience: config.auth.api.identifier,
                scope: "read:vehicle"
            });
            
            const response = await fetch(
                `${serverUrl}/api/vehicle?junction_id=${junction_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            return await response.json();
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        async function fetchAndSetData() {
            const res = await getVehicleDataSecurely(props.camera);
            let newData = []
            const entrance_row = {id: "Number of cars entered this camera", value: res.entrance}
            const exit_row = {id: "Number of cars exiting through this camera", value: res.exit}
            newData.push(entrance_row)
            newData.push(exit_row)
            const routes = res.route
            const route_keys = Object.keys(routes)
            const header = { id: 'Routes: ', value: '' }
            newData.push(header);
            for (let i = 0; i < route_keys.length; i++) {
                const row = { id: `${route_keys[i]}`, value: `${routes[route_keys[i]]}` }
                newData.push(row);
            }
            setVehicleData(newData);
        }
        fetchAndSetData()
    }, [props.camera])

    const classes = useStyles();
    return (
        <Paper className={classes.root} elevation={10}>
            <DataGrid className={classes.grid} rows={vehicleData} columns={columns} pageSize={9} disableColumnMenu />
        </Paper>
    )
}

export default Table;