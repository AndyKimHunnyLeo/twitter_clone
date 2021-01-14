import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Firebase from './firebase';
console.log(Firebase);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
