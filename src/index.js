import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {HashRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    // <React.StrictMode>
    // <BrowserRouter basename="/travel_logistics_analytics_service_frontend_react">
    <HashRouter>
        <App/>
    </HashRouter>
    // </BrowserRouter>
    // </React.StrictMode>
);

reportWebVitals();
