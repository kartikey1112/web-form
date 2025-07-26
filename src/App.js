
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import FormPage from './pages/FormPage';
import LeadsPage from './pages/LeadsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/leads" element={<LeadsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
