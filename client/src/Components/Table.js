import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { makeStyles, TableBody, TableCell, TableRow } from '@material-ui/core';
import config from '../config.json';

const useStyles = makeStyles((theme) => ({
    root: {
        marginRight: '2vw',
        height: '55vh'
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

    const [vehicleData, setVehicleData] = useState([]);

    /**
     * Gets the vehicle data based on the current junction in view
     * @param {integer} junction_id 
     * @returns {json} vehicle data
     */
    async function getVehicleDataSecurely(junction_id) {
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
            const vehicleData = await getVehicleDataSecurely('id0');
            console.log(vehicleData);
            setVehicleData(vehicleData);
        }
        fetchAndSetData()
    }, [])

    const classes = useStyles();
    return (
        <Table className={classes.root} elevation={10}>
            <TableBody>
                <TableRow key='entrance'>
                    <TableCell>Number of vehicles using this entrance</TableCell>
                    <TableCell align="right">{vehicleData.entrance}</TableCell>
                </TableRow>
                <TableRow key='exit'>
                    <TableCell>Number of vehicles using this exit</TableCell>
                    <TableCell align="right">{vehicleData.exit}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export default Table;