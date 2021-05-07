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

const Table = (props) => {

    const { getAccessTokenSilently } = useAuth0();
    //const serverUrl = `https://${config.network.server.domain}:${config.network.server.https.port}`;
    let serverUrl;
    if(config.network.server.https) {
        serverUrl = `https://${config.network.server.https.domain}:${config.network.server.https.port}`;
    } else {
        serverUrl = `http://${config.network.server.domain}:${config.network.server.http_port}`;
    }
    const [vehicleData, setVehicleData] = useState([]);

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.1 },
        { field: 'time', headerName: 'Entrance Time', flex: 0.3 },
        { field: 'dirOut', headerName: 'Direction Out', flex: 0.3 },
        { field: 'route', headerName: 'Route taken', flex: 0.3 }
    ];

    async function getVehicleDataSecurely(camera) {
        try {
            const token = await getAccessTokenSilently({
                audience: config.auth.api.identifier,
                scope: "read:vehicle"
            });
            const d = new Date();
            const ent_time = d.getTime();
            const req_path = `${serverUrl}/api/vehicle?entrance_id=${props.camera}&entrance_time=${ent_time}`;
            console.log(req_path);
            const response = await fetch(
                req_path,
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


    useEffect(() => {
        async function fetchAndSetData() {
            const jsonData = await getVehicleDataSecurely('CAMERA-1');
            let arrayData = [];
            const ents = jsonData.time;
            const dLen = Object.keys(ents).length;
            for (let i = 0; i < dLen; i++) {
                const row = { id: i + 1, time: jsonData.time[i], dirOut: jsonData.exit[i], route: jsonData.route[i] }
                arrayData.push(row);
            }
            setVehicleData(arrayData);
        }
        fetchAndSetData()
    }, [])

    useEffect(() => {
        async function fetchAndSetData() {
            const jsonData = await getVehicleDataSecurely(props.camera);
            let arrayData = [];
            const ents = jsonData.time;
            const dLen = Object.keys(ents).length;
            for (let i = 0; i < dLen; i++) {
                const row = { id: i + 1, time: jsonData.time[i], dirOut: jsonData.exit[i], route: jsonData.route[i] }
                arrayData.push(row);
            }
            setVehicleData(arrayData);
        }
        fetchAndSetData()
        console.log(vehicleData);
    }, [props.camera])

    const classes = useStyles();
    return (
        <Paper className={classes.root} elevation={10}>
            <DataGrid id='datagrid' rows={vehicleData} columns={columns} pageSize={10} />
        </Paper>
    )
}

export default Table;