import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history';
import App from './App.js';
import reportWebVitals from './Services/Logging/reportWebVitals';
import config from './config.json';
import { io } from 'socket.io-client';

let serverUrl;
if (config.network.server.https) {
    serverUrl = `https://${config.network.server.https.domain}:${config.network.server.https.port}`;
} else {
    serverUrl = `http://${config.network.server.domain}:${config.network.server.http.port}`;
}

function initSocket() {
    const socket = io(serverUrl);
    socket.on("connect", () => {
        console.log("socket connected");
    });

    return socket;
}

// Render App component into the browser
ReactDOM.render(
  <Router>
    <Auth0ProviderWithHistory>
      <App socket={initSocket()} serverUrl={serverUrl}/>
    </Auth0ProviderWithHistory>
  </Router>,
  document.getElementById('root')
);

reportWebVitals(console.log);