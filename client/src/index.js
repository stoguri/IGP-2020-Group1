import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history';
import App from './App.js';
import reportWebVitals from './Services/Logging/reportWebVitals';
import config from './config.json';
import { io } from 'socket.io-client';
import { initSocket } from './Components/Socket.js'; 
import {SocketContext, socket} from './context/socket.js';
//import Child from 'components/Child';

/*
const App = () => {
  return (
    <SocketContext.Provider value={socket}>
      <Child />
      <Child />
      ...
    </SocketContext.Provider
  );
};
*/

let serverUrl;
if (config.network.server.https) {
    serverUrl = `https://${config.network.server.https.domain}:${config.network.server.https.port}`;
} else {
    serverUrl = `http://${config.network.server.domain}:${config.network.server.http.port}`;
}

// Render App component into the browser
ReactDOM.render(
  <SocketContext.Provider value={socket}>
    <Auth0ProviderWithHistory>
      <App serverUrl={serverUrl}/>
    </Auth0ProviderWithHistory>
  </SocketContext.Provider>,
  document.getElementById('root')
);

/*
ReactDOM.render(
  <SocketContext.Provider value={socket}>
    <Router>
      <Auth0ProviderWithHistory>
        <App serverUrl={serverUrl}/>
      </Auth0ProviderWithHistory>
    </Router>
  </SocketContext.Provider>,
  document.getElementById('root')
);
*/
/*
ReactDOM.render(
  <Router>
    <Auth0ProviderWithHistory>
      <App socket={initSocket()} serverUrl={serverUrl}/>
    </Auth0ProviderWithHistory>
  </Router>,
  document.getElementById('root')
);
*/

reportWebVitals(console.log);