import React from 'react';
import './Home.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Card from './Card';
import ErrorBoundary from './Error';


function Home() {
  return (
    <div>
   
      <nav className="navbar">
      
        <div className="left-section">
          <div className="logo-circle">RI</div>
          <div className="company-name">Rajodya Infotech &nbsp; &nbsp; &nbsp;</div>
        </div>

       
        <div className="center-section">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search"
              className="form-control search-input"
            />
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
          </div>
        </div>

       
        <div className="right-section">
          Dashboard &gt; Staff &gt; Employee
        </div>
      </nav>

      <ErrorBoundary>
      <Card />
    </ErrorBoundary>

   
    </div>
  );
}

export default Home;
