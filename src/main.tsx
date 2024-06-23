import 'regenerator-runtime/runtime';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Submit from './components/Submit/index.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>

      <Routes>
        <Route index element={<App />} />
        <Route path="/submit" element={<Submit />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
