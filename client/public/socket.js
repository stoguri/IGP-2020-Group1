// import config from '../config.json';

// let serverUrl;
// if (config.network.server.https) {
//     serverUrl = `https://${config.network.server.https.domain}:${config.network.server.https.port}`;
// } else {
//     serverUrl = `http://${config.network.server.domain}:${config.network.server.http.port}`;
// }
serverUrl = 'https://chungus.co.uk';

let socket;

function initSocket() {
    socket = io(serverUrl);
    socket.on("connect", () => {
        console.log("socket connected");
    });

    socket.on("vehicleDataUpdate", vehicleDataUpdate);
    socket.on("vehicleBoundingBox", vehicleBoundingBoxUpdate);
}

function vehicleDataUpdate(message) {
    console.log("vehicle data update");
}

function vehicleBoundingBoxUpdate(message) {
    console.log("bounding box update");
}

console.log(socket);
initSocket();

