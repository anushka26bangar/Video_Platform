import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const AdminVideoPage = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef({}); // To store video elements
  const user_id = 1; // Replace with actual user ID

  // Fetch videos on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/videos')
      .then((response) => {
        if (Array.isArray(response.data.videos)) {
          setVideos(response.data.videos);
        } else {
          setVideos([]); // Fallback to an empty array
        }
      })
      .catch((error) => {
        console.error('Error fetching videos:', error);
        setVideos([]);
      });
  }, []);

  const handleDelete = (videoId) => {
    axios.delete(`http://localhost:5000/api/videos/${videoId}`)
      .then(() => {
        setVideos((prevVideos) => prevVideos.filter((video) => video.id !== videoId));
        alert('Video deleted successfully.');
      })
      .catch((error) => {
        console.error('Error deleting video:', error);
        alert('Failed to delete the video.');
      });
  };

  return (
    <div style={styles.videoPageContainer}>
      <h1 style={styles.videoPageHeading}>Admin: Manage Videos</h1>
      {videos.length > 0 ? (
        videos.map((video, index) => (
          <div style={styles.videoCard} key={index}>
            <h2 style={styles.videoTitle}>{video.name}</h2>
            <video
              style={styles.videoPlayer}
              controls
              ref={(el) => (videoRefs.current[video.id] = el)}
            >
              <source src={`http://localhost:5000/uploads/${video.name}`} type="video/mp4" />
              <track kind="captions" srcLang="en" label="English" default />
              Your browser does not support the video tag.
            </video>
            <button
              style={styles.deleteButton}
              onClick={() => handleDelete(video.id)}
            >
              Delete Video
            </button>
          </div>
        ))
      ) : (
        <p style={styles.noVideosText}>No videos available.</p>
      )}
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
  deleteButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
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

export default AdminVideoPage;
