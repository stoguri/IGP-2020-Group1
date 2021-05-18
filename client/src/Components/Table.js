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

export const Table = (props) => {
    const { getAccessTokenSilently } = useAuth0();

    const columns = [
        {field: "id", headerName: 'Field', flex: 0.75, sortable: false},
        {field: "value", headerName: "Value", flex: 0.25, sortable: false}
    ]

    const [vehicleData, setVehicleData] = useState([]);

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

            // get initial data
            const response = await fetch(
                `${props.serverUrl}/api/vehicle?junction_id=${props.camera}`,
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

    function vehicleDataUpdate(message) {
        console.log("vehicle data update received");
    
        /* data structure
         * fields value is incremented by 1 if given
        message = {
            junction_id: 'id0',
            fields: ["Number of cars entered through this camera", "id0->id1"]
        }
        */
    
        // check if vehicle data is for junction currently in view
        if(message.junction_id != props.camera) {
            return;
        }
    
        // update fields that have changed
        // find row in vehicle data where id matches field to be updated
        for(const row of vehicleData) {
            for(const field of message.fields) {
                if(row.id == field) {
                    row.value++;
                }
            }
        }
        const newData = [];
        // spread data without creating copy
        for(let i = 0; i < vehicleData.length; i++) {
            newData[i] = {...vehicleData[i]};
        }
        // set table data
        setVehicleData(newData);
    };

    props.socket.on("vehicleDataUpdate", vehicleDataUpdate);

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