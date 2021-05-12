import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { makeStyles, Paper } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import config from '../config.json';
import { initSocket } from '../Components/Socket.js';
import { io } from 'socket.io-client';

const useStyles = makeStyles((theme) => ({
    root: {
        marginRight: '2vw',
        height: '55vh'
    },
    grid: {

    }
}));

let serverUrl;
if (config.network.server.https) {
    serverUrl = `https://${config.network.server.https.domain}:${config.network.server.https.port}`;
} else {
    serverUrl = `http://${config.network.server.domain}:${config.network.server.http.port}`;
}

export const Table = (props) => {
    const { getAccessTokenSilently } = useAuth0();

    const columns = [
        {field: "id", headerName: 'Field', flex: 0.75, sortable: false},
        {field: "value", headerName: "Value", flex: 0.25, sortable: false}
    ]

    const [vehicleData, setVehicleData] = useState([]);
    let currentVehicleData;

    function onMessage(e) {
        // check if vehicle data is for junction currently in view
        if(e.junction_id != props.camera) {
            return;
        }

        // update fields that have changed
        // find row in vehicle data where id matches field to be updated
        for(const row of currentVehicleData) {
            for(const field of e.fields) {
                if(row.id == field) {
                    row.value++;
                }
            }
        }
        // set table data
        setVehicleData(currentVehicleData);
    }

    function makeSocket() {    
        // initialise socket for updating data in real time
        let socket = io(serverUrl);
    
        socket.on("vehicleDataUpdate", onMessage);
    
        socket.on("connect", () => {
            console.log("socket connected");
        })
    }


    /**
     * Gets the vehicle data based on the current junction in view
     * @returns {json} vehicle data
     */
    async function getVehicleDataSecurely() {
        try {
            const token = await getAccessTokenSilently({
                audience: config.auth.api.identifier,
                scope: "read:vehicle"
            });

            makeSocket();

            // get initial data
            const response = await fetch(
                `${serverUrl}/api/vehicle?junction_id=${props.camera}`,
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
            const entrance_row = {id: "Number of cars entered through this camera", value: res.entrance}
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
            currentVehicleData = newData;

            //initSocket(props.camera, newData, setVehicleData);
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