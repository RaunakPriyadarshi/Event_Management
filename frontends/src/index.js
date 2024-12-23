import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global styles
import App from './App'; // Main App component

// Create the root DOM node and render the App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Remove unused `reportWebVitals` and clean up the file
