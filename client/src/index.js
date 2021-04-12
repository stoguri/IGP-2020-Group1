import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './services/reportWebVitals';
import './index.css';
import App from './components/App';



// Render App component into the browser
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);



