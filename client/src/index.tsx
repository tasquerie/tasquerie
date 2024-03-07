import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './Context/AuthContext';
// import { TestAuthContextProvider } from './Context/AuthContext';
import 'font-awesome/css/font-awesome.min.css';
import Auth from './Context/Auth'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

let authenticator = new Auth();

root.render(
  // <AuthContextProvider>
  //   <React.StrictMode>
  //     <App />
  //   </React.StrictMode>
  // </AuthContextProvider>
  <AuthContextProvider value = {authenticator}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
</AuthContextProvider>

);
