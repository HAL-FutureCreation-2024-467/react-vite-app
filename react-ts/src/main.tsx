import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Router } from './router/Router';
import { BrowserRouter } from 'react-router-dom';
import 'react-tooltip/dist/react-tooltip.css'
// import '@assets/js/live2dcubismcore.min.js';
// import '@assets/js/live2d.min.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </React.StrictMode>
)
