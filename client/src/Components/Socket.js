import { io } from 'socket.io-client';
import config from '../config.json';

let serverUrl;
if (config.network.server.https) {
    serverUrl = `https://${config.network.server.https.domain}:${config.network.server.https.port}`;
} else {
    serverUrl = `http://${config.network.server.domain}:${config.network.server.http.port}`;
}

let junction_id, vehicleData, setVehicleData;

function vehicleDataUpdate(e) {
    console.log("vehicle data update received");

    /* data structure
     * fields value is incremented by 1 if given
    e = {
        junction_id: 'id0',
        fields: ["Number of cars entered through this camera", "id0->id1"]
    }
    */

    // check if vehicle data is for junction currently in view
    if(e.junction_id != junction_id) {
        return;
    }

    // update fields that have changed
    // find row in vehicle data where id matches field to be updated
    for(const row of vehicleData) {
        for(const field of e.fields) {
            if(row.id == field) {
                row.value++;
            }
        }
    }
    // set table data
    setVehicleData([...vehicleData]);
};

export const initSocket = (j_id, vData, set_vData) => {
    junction_id = j_id;
    vehicleData = vData;
    setVehicleData = set_vData;

    // initialise socket for updating data in real time
    let socket = io(serverUrl);

    socket.on("vehicleDataUpdate", vehicleDataUpdate);

    socket.on("connect", () => {
        console.log("socket connected");
    })
}

export default initSocket;