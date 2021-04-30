// sets up some extra stuff we can't do easily through the main package.json
'use strict';

const config = require('./client/src/config.json');
const fs = require('fs');

const logger = (err) => {
    if(err) console.error(err);
}

fs.unlink('./client/.env', logger);

// create env file
// - set port from config
// - set up https if provided
let content = `PORT=${config.network.client.port}`; 
if(config.network.server.https) {
    content += `\nHTTPS=true` +
    `\nSSL_CRT_FILE=${config.network.server.https.certificate}` +
    `\nSSL_KEY_FILE=${config.network.server.https.key}`;
}
fs.appendFile('./client/.env', content, logger);

// set homepage in client package