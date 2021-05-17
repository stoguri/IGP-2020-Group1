import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history';
import App from './App.js';
import reportWebVitals from './Services/Logging/reportWebVitals';

// Render App component into the browser
ReactDOM.render(
  <Router>
    <Auth0ProviderWithHistory>
      <App/>
    </Auth0ProviderWithHistory>
  </Router>,
  document.getElementById('root')
);

reportWebVitals(console.log);