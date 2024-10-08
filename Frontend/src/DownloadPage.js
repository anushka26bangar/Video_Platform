import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DownloadPage() {
    const [videos, setVideos] = useState([]);
    const [isPremium, setIsPremium] = useState(false);
    const user_id = 1; // Replace with actual user ID

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/getDownloads/${user_id}`);
                if (response.status === 200) {
                    const { videos, isPremium } = response.data;
                    setVideos(videos);
                    setIsPremium(isPremium);
                }
            } catch (error) {
                console.error('Error fetching downloads:', error);
            }
        };

        fetchData();
    }, [user_id]);

    const handleGoPremium = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/upgradePlan', { user_id });
            if (response.status === 200) {
                alert('Plan upgraded to premium.');
                setIsPremium(true);
            }
        } catch (error) {
            console.error('Error upgrading to premium:', error);
        }
    };

    return (
        <div style={styles.pageContainer}>
            <h1>Your Downloads</h1>
            <div style={styles.videoList}>
                {videos.map(video => (
                    <div key={video.video_id} style={styles.videoItem}>
                        <h3>{video.title}</h3>
                        {/* Download button component is removed to enforce download rules */}
                    </div>
                ))}
            </div>
            {!isPremium && (
                <button onClick={handleGoPremium} style={styles.premiumButton}>
                    Go Premium
                </button>
            )}
        </div>
    );
}

const styles = {
    pageContainer: {
        padding: '40px',
        backgroundColor: '#f8f8f8',
        minHeight: '100vh',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
    },
    videoList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    videoItem: {
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    premiumButton: {
        marginTop: '30px',
        padding: '10px 20px',
        backgroundColor: '#FFD700',
        color: '#000',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        borderRadius: '8px',
        transition: 'background-color 0.3s ease',
    }
};

export default DownloadPage;
