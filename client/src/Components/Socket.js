import { io } from 'socket.io-client';
import config from '../config.json';
import { Table } from './Table.js';

let serverUrl;
if (config.network.server.https) {
    serverUrl = `https://${config.network.server.https.domain}:${config.network.server.https.port}`;
} else {
    serverUrl = `http://${config.network.server.domain}:${config.network.server.http.port}`;
}

function onMessage(e) {
    console.log("message received");
    console.log(e);

    /*
    {
        junction_id: id0,
        fields: {
            "entrance": 4
            "id0->id1": 3
        }
    }
    */

    // get current data from table

    // update fields that have changed

    // set table data
};

export const initSocket = () => {
    // initialise socket for updating data in real time
    let socket = io(serverUrl);

    socket.on("message", onMessage);

    socket.on("connect", () => {
        console.log("socket connected");
    });
    socket.emit("id0", "message");

    return socket;
}

export default initSocket;