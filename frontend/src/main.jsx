import React from 'react';
import { creatRoot } from 'react-dom/client';
import App from './App.js'

const container = document.getElementById('root');
const root = creatRoot(container);
root.render(<App />);