import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaVideo, FaDownload, FaPhone, FaArrowRight, FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';

const UserHomePage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef({});
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const hour = new Date().getHours();
    setTheme(hour < 18 ? 'light' : 'dark');

    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos');
        if (response.data.videos) {
          setVideos(response.data.videos);
        } else {
          console.error('Unexpected response structure:', response.data);
          setVideos([]);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setVideos([]);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const handleTimeUpdate = (videoElement) => {
      if (videoElement.currentTime >= 300) { // 5 minutes
        videoElement.pause();
        alert("Upgrade plan to continue watching.");
        videoElement.currentTime = 0;
      }
    };

    const videoElements = videoRefs.current;

    // Set the time update event listener for each video
    Object.values(videoElements).forEach((videoElement) => {
      if (videoElement) {
        videoElement.ontimeupdate = () => handleTimeUpdate(videoElement);
      }
    });

    return () => {
      // Cleanup the event listeners on unmount
      Object.values(videoElements).forEach((videoElement) => {
        if (videoElement) {
          videoElement.ontimeupdate = null;
        }
      });
    };
  }, [videos]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <div className={`homepage-container ${theme}`}>
      <style>
        {`
          .homepage-container {
            font-family: 'Arial', sans-serif;
            background-color: ${theme === 'dark' ? '#333' : '#f4f4f4'};
            color: ${theme === 'dark' ? 'white' : '#333'};
            padding: 20px;
          }
          .navbar {
            display: flex;
            justify-content: space-around;
            background-color: ${theme === 'dark' ? '#444' : '#007bff'};
            padding: 10px;
            border-radius: 5px;
          }
          .nav-link {
            color: white;
            text-decoration: none;
            font-weight: bold;
            transition: color 0.3s;
          }
          .nav-link:hover {
            color: #ffcc00;
          }
          .header {
            text-align: center;
            margin: 20px 0;
          }
          .header h1 {
            color: ${theme === 'dark' ? '#ffcc00' : '#333'};
          }
          .header p {
            color: ${theme === 'dark' ? '#cccccc' : '#555555'};
          }
          .video-page-container {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
          }
          .video-page-heading {
            text-align: center;
            margin-bottom: 20px;
            font-size: 24px;
            color: ${theme === 'dark' ? '#ffcc00' : '#007bff'};
            width: 100%;
          }
          .video-card {
            background: ${theme === 'dark' ? '#444' : '#fff'};
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 15px;
            margin: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            flex: 0 0 48%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .video-title {
            font-size: 20px;
            margin-bottom: 10px;
            color: ${theme === 'dark' ? 'white' : '#333'};
            text-align: center;
          }
          .video-player {
            width: 100%;
            height: auto;
            border-radius: 5px;
            margin-bottom: 10px;
          }
          .no-videos-text {
            text-align: center;
            font-size: 18px;
            color: ${theme === 'dark' ? 'white' : '#333'};
            width: 100%;
          }
        `}
      </style>

      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="nav-link">
          <FaHome /> Home
        </Link>
        <Link to="/groups" className="nav-link">
          <FaUsers /> Groups
        </Link>
        <Link to="/plans" className="nav-link">
          <FaArrowRight /> Plans
        </Link>
        <Link to="/downloads" className="nav-link">
          <FaDownload /> Downloads
        </Link>
        <Link to="/user-videos" className="nav-link">
          <FaVideo /> Videos
        </Link>
        <Link to="/videocall" className="nav-link">
          <FaPhone /> Video Call
        </Link>
        <Link to="/profile" className="nav-link">
          <FaUser /> Profile
        </Link>
        <Link to="/" className="nav-link" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </Link>
      </nav>

      <header className="header">
        <h1>User Page</h1>
        <p>Currently using {theme === 'light' ? 'Day Mode' : 'Night Mode'} based on your local time.</p>
      </header>

      {/* VideoPage content */}
      <div className="video-page-container">
        {videos && videos.length > 0 ? (
          videos.map((video) => (
            <div className="video-card" key={video.id}>
              <h2 className="video-title">{video.title}</h2>
              <video
                ref={(el) => (videoRefs.current[video.id] = el)}
                className="video-player"
                controls
                src={video.url}
                preload="metadata"
                controlsList="nodownload noplaybackrate" // Added controlsList to disable download and playback rate
              />
            </div>
          ))
        ) : (
          <p className="no-videos-text">No videos available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default UserHomePage;
