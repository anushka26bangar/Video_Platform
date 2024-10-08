import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaDownload, FaVideo, FaPhone, FaArrowRight } from 'react-icons/fa'; // Import react-icons

function AdminHomePage() {
  const [theme, setTheme] = useState('light');

  // Dynamic theme based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  return (
    <div className={`homepage-container ${theme}`}>
      <header>
        <h1>Admin Side</h1>
        <p>Currently using {theme === 'light' ? 'Day Mode' : 'Night Mode'} based on your local time.</p>
      </header>

      <div className="groups-overview">
        <h2 className="section-title"><FaUsers /> Groups Overview</h2>
        <p>Manage your groups or create new ones.</p>
        <Link to="/groups">
          <button className="button">Manage Group</button>
        </Link>
      </div>

      <div className="plans-preview">
        <h2 className="section-title"><FaArrowRight /> Upgrade Plans</h2>
        <div className="plan-box plan-bronze">Bronze Plan (10rs)</div>
        <div className="plan-box plan-silver">Silver Plan (50rs)</div>
        <div className="plan-box plan-gold">Gold Plan (100rs)</div>
        <Link to ="/plans">
        <button className="button">Go Premium</button>
        </Link>
      </div>
      <div className="video-section">
  <h2 className="section-title"><FaVideo /> Upload Video</h2>
  <div>
    <Link to="/upload-video">
      <button className="button">Upload Video</button>
    </Link>
    <Link to="/admin-videos">
      <button className="button">Videos</button>
    </Link>
  </div>
</div>

      <div className="download-section">
        <h2 className="section-title"><FaDownload /> Downloaded Videos</h2>
        <p>List Of Downloaded Videos by Users</p>
        <Link to ="/downloads">
         <button className="button">View Downloads</button>
         </Link>       
      </div>

      <div className="voip-feature">
        <h2 className="section-title"><FaPhone /> Video Call Feature</h2>
        <p>Video Call Report</p>
        <Link to ="/videocall">
        <button className="button">View Report</button>
        </Link>        
      </div>

      <footer>
        <p>All rights reserved © Video Platform</p>
      </footer>

      <style>{`
      body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        overflow-x: hidden; /* Prevents horizontal overflow */
      }

      .homepage-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 60px; /* Adjusted for navbar height */
        min-height: 100vh;
      }

      header {
        background-color: #1f1f1f;
        padding: 20px;
        width: 100%;
        color: #e0e0e0;
        text-align: center;
      }

      .groups-overview, .plans-preview, .video-section, .download-section, .voip-feature {
        margin: 20px 0;
        padding: 20px;
        width: 80%;
        border-radius: 8px;
        background-color: #333;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
      }

      .section-title {
        font-size: 1.5rem;
        margin-bottom: 10px;
        color: #e0e0e0;
      }

      .button {
        padding: 10px 20px;
        border: none;
        background-color: #007bff;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .button:hover {
        background-color: #0056b3;
      }

      .plan-box {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        padding: 10px;
        border: 2px solid #444;
        border-radius: 8px;
        text-align: center;
        background-color: #444;
        cursor: pointer;
        color: #e0e0e0;
      }

      .plan-box:hover {
        background-color: #555;
      }

      .plan-gold { border-color: gold; }
      .plan-silver { border-color: silver; }
      .plan-bronze { border-color: #cd7f32; }

      .homepage-container.light {
        background-color: #ffffff;
        color: #333;
      }

      .homepage-container.dark {
        background-color: #121212;
        color: #e0e0e0;
      }
      `}</style>
    </div>
  );
}

export default AdminHomePage;
