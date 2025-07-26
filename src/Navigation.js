import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>AI Lead Generator</h1>
        </div>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Submit Inquiry
          </Link>
          <Link 
            to="/leads" 
            className={`nav-link ${location.pathname === '/leads' ? 'active' : ''}`}
          >
            View Leads
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 