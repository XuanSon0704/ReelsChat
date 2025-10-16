import React from 'react';
import { creatRoot } from 'react-dom/client';
import App from './App.jsx'

const container = document.getElementById('root');
const root = creatRoot(container);
root.render(<App />);