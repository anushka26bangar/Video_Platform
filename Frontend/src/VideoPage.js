import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const VideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [userPlan, setUserPlan] = useState('free'); // Default plan is 'free'
  const videoRefs = useRef({}); // To store video elements
  const user_id = 1; // Replace with actual user ID

  // Fetch new videos, download history, and user plan on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/videos') // Ensure to upload new videos here
      .then((response) => {
        if (Array.isArray(response.data.videos)) {
          setVideos(response.data.videos);
        } else {
          setVideos([]); // Fallback to an empty array
        }
      })
      .catch((error) => {
        console.error('Error fetching videos:', error);
        setVideos([]); // In case of error, set to an empty array
      });

    axios.get(`http://localhost:5000/api/downloads?user_id=${user_id}`)
      .then((response) => {
        setDownloadHistory(response.data);
      })
      .catch((error) => {
        console.error('Error fetching download history:', error);
        setDownloadHistory([]);
      });

    axios.get(`http://localhost:5000/api/user-plan?user_id=${user_id}`)
      .then((response) => {
        setUserPlan(response.data.plan || 'free');
      })
      .catch((error) => {
        console.error('Error fetching user plan:', error);
        setUserPlan('free');
      });
  }, []);

  const getAllowedTime = () => {
    switch (userPlan) {
      case 'bronze':
        return 7 * 60; // 7 minutes in seconds
      case 'silver':
        return 10 * 60; // 10 minutes in seconds
      case 'gold':
        return Infinity; // No time limit
      default:
        return 5 * 60; // 5 minutes for free users
    }
  };

  const handleTimeLimit = (videoId) => {
    const videoElement = videoRefs.current[videoId];
    const allowedTime = getAllowedTime();

    if (videoElement) {
      videoElement.ontimeupdate = () => {
        if (videoElement.currentTime >= allowedTime) {
          videoElement.pause();
          alert(`Your video time limit of ${allowedTime / 60} minutes has been reached. Upgrade your plan to watch more.`);
        }
      };
    }
  };

  const handleDownload = (video) => {
    const today = new Date().toISOString().split('T')[0];
    const hasDownloadedToday = downloadHistory.some(
      (download) => download.date === today
    );

    if (hasDownloadedToday) {
      alert('You have already downloaded a video today. Buy premium to download more videos.');
    } else {
      window.location.href = `http://localhost:5000/api/download/${video.id}`;
      axios.post('http://localhost:5000/api/downloads', { user_id, videoId: video.id, date: today })
        .then((response) => {
          setDownloadHistory((prevHistory) => [...prevHistory, { videoId: video.id, date: today }]);
        })
        .catch((error) => {
          console.error('Error updating download history:', error);
        });
    }
  };

  const handleUpgradePlan = () => {
    // Redirect to UpgradePlan.js page
    window.location.href = '/plans'; // Adjust this based on your routing
  };

  return (
    <div style={styles.videoPageContainer}>
      <h1 style={styles.videoPageHeading}>Uploaded Videos</h1>
      {videos.length > 0 ? (
        videos.map((video, index) => (
          <div style={styles.videoCard} key={index}>
            <h2 style={styles.videoTitle}>{video.name}</h2>
            <video
              style={styles.videoPlayer}
              controls
              ref={(el) => (videoRefs.current[video.id] = el)}
              onPlay={() => handleTimeLimit(video.id)}
              onContextMenu={(e) => {
                e.preventDefault(); // Disable right-click context menu
                alert('Download options are disabled.');
              }}
              controlsList="nodownload noplaybackrate" // Added controlsList to disable download and playback rate
            >
              <source src={`http://localhost:5000/uploads/${video.name}`} type="video/mp4" />
              <track kind="captions" srcLang="en" label="English" default />
              Your browser does not support the video tag.
            </video>
          </div>
        ))
      ) : (
        <p style={styles.noVideosText}>No videos available.</p>
      )}
      <button style={styles.upgradeButton} onClick={handleUpgradePlan}>Upgrade Plan</button>
    </div>
  );
};

const styles = {
  videoPageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f0f0f5',
    minHeight: '100vh',
  },
  videoPageHeading: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '30px',
  },
  videoCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '20px',
    margin: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '600px',
  },
  videoTitle: {
    fontSize: '1.5rem',
    marginBottom: '15px',
    color: '#333',
  },
  videoPlayer: {
    width: '100%',
    borderRadius: '10px',
    marginBottom: '15px',
  },
  upgradeButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  noVideosText: {
    fontSize: '1.2rem',
    color: '#777',
  },
};

export default VideoPage;
