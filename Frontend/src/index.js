// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { Buffer } from 'buffer';
import process from 'process';
window.process = process;
window.Buffer = Buffer;


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
