import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaVideo, FaDownload, FaPhone, FaArrowRight, FaHome, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef({});
  const [theme, setTheme] = useState('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(loggedIn === 'true');
      if (loggedIn !== 'true') {
        alert('Please log in to access the homepage.');
        navigate('/');
      }
    };

    checkLoginStatus();

    const hour = new Date().getHours();
    setTheme(hour < 18 ? 'light' : 'dark');

    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos');
        console.log('Fetched videos:', response.data);
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
  }, [navigate]);

  useEffect(() => {
    const handleTimeUpdate = (videoElement) => {
      if (videoElement.currentTime >= 300) {
        videoElement.pause();
        alert("Upgrade plan to continue watching.");
        videoElement.currentTime = 0;
      }
    };

    const videoElements = videoRefs.current;

    Object.values(videoElements).forEach((videoElement) => {
      if (videoElement) {
        videoElement.ontimeupdate = () => handleTimeUpdate(videoElement);
      }
    });

    return () => {
      Object.values(videoElements).forEach((videoElement) => {
        if (videoElement) {
          videoElement.ontimeupdate = null;
        }
      });
    };
  }, [videos]);

  const handleNavClick = (path) => {
    if (!isLoggedIn && path !== '/login' && path !== '/signup' && path !== '/') {
      setRedirectPath(path);
      setShowAlert(true);
    } else {
      navigate(path);
    }
  };

  const handleAlertResponse = (response) => {
    if (response === 'login') {
      navigate('/login');
    } else {
      navigate('/');
    }
    setShowAlert(false);
  };

  return (
    <div className={`homepage-container ${theme}`}>
      {/* Alert */}
      {showAlert && (
        <div className="alert">
          <p>Please log in to access this page.</p>
          <button onClick={() => handleAlertResponse('login')}>Login</button>
          <button onClick={() => handleAlertResponse('okay')}>Okay</button>
        </div>
      )}

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
          .custom-alert {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
          }
          .custom-alert h2 {
            margin: 0;
            margin-bottom: 10px;
          }
          .custom-alert button {
            margin-right: 10px;
          }
          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }
        `}
      </style>

      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="nav-link" onClick={() => handleNavClick('/')}>
          <FaHome /> Home
        </Link>
        <Link to="/" className="nav-link" onClick={() => handleNavClick('/groups')}>
          <FaUsers /> Groups
        </Link>
        <Link to="/" className="nav-link" onClick={() => handleNavClick('/plans')}>
          <FaArrowRight /> Plans
        </Link>
        <Link to="/" className="nav-link" onClick={() => handleNavClick('/downloads')}>
          <FaDownload /> Downloads
        </Link>
        <Link to="/" className="nav-link" onClick={() => handleNavClick('/user-videos')}>
          <FaVideo /> Videos
        </Link>
        <Link to="/" className="nav-link" onClick={() => handleNavClick('/videocall')}>
          <FaPhone /> Video Call
        </Link>
        <Link to="/signup" className="nav-link" onClick={() => handleNavClick('/signup')}>
          <FaUserPlus /> Signup
        </Link>
        <Link to="/login" className="nav-link" onClick={() => handleNavClick('/login')}>
          <FaSignInAlt /> Login
        </Link>
      </nav>

      <header className="header">
        <h1>Welcome to the User Homepage</h1>
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

export default HomePage;
