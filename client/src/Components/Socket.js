import config from '../config.json';
import { io } from 'socket.io-client';

let serverUrl;
if (config.network.server.https) {
    serverUrl = `https://${config.network.server.https.domain}:${config.network.server.https.port}`;
} else {
    serverUrl = `http://${config.network.server.domain}:${config.network.server.http.port}`;
}

let junction_id, vehicleData, setVehicleData;

export const initSocket = (j_id, vData, set_vData) => {
    const socket = io(serverUrl);
    socket.on("connect", () => {
        console.log("vehicle data socket connected");
    });

    // junction_id = j_id;
    // vehicleData = vData;
    // setVehicleData = set_vData;

    socket.on("vehicleDataUpdate", vehicleDataUpdate);

    return socket;
}

export const setSocket_vehicleData = (j_id, vData, set_vData) => {
    junction_id = j_id;
    vehicleData = vData;
    setVehicleData = set_vData;
}

export const vehicleDataUpdate = (message) => {
    console.log("vehicle data update received");
    console.log(message);
  
    /* data structure
     * fields value is incremented by 1 if given
    message = {
        junction_id: 'id0',
        fields: ["Number of cars entered through this camera", "id0->id1"]
    }
    */
  
    // check if vehicle data is for junction currently in view
    if(message.junction_id != junction_id) {
        return;
    }
  
    // update fields that have changed
    // find row in vehicle data where id matches field to be updated
    for(const row of vehicleData) {
        for(const field of Object.keys(message.fields)) {
            if(row.id == field) {
                row.value = message.fields[field];
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

// bounding box socket
export const initSocket_boundingBox = () => {
    const socket = io(serverUrl + '/boundingBox');
    socket.on("connect", () => {
        console.log("bounding box socket connected");
    });

    return socket;
}
