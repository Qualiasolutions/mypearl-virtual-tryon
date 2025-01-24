// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Get root element
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Enable strict mode for better development practices
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);