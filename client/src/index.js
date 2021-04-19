import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import reportWebVitals from './Services/Logging/reportWebVitals';
import App from './App.js';

// Render App component into the browser
ReactDOM.render(
  <BrowserRouter>
    <Auth0Provider
      domain='dev-1ica07er.eu.auth0.com'
      clientId='WcaPsPE80oAYEvHyhHVnnQpzoiaTkeUF'
      redirectUri={'http://localhost:8081/home'}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);



