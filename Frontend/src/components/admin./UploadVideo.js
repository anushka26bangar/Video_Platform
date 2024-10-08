import React, { useState } from 'react';
import axios from 'axios';

function UploadVideo() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);
    const [uploadedFilename, setUploadedFilename] = useState(''); // To store the filename for deletion

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 400 * 1024 * 1024) { // Check file size (400 MB)
            setSelectedFile(file);
            setUploadMessage(''); // Clear any previous error message
        } else {
            setUploadMessage('File size must be less than 400 MB.');
        }
    };

    // Handle file upload
    const handleFileUpload = async () => {
        if (!selectedFile) {
            setUploadMessage('Please select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('video', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                setUploadMessage('Video uploaded successfully!');
                setUploadedFilename(response.data.filename); // Save the filename for deletion
                setUploadedVideoUrl(`http://localhost:5000/uploads/${response.data.filename}`); // Set the uploaded video's URL
            } else {
                setUploadMessage('Failed to upload video. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            setUploadMessage('Error uploading video. Please try again.');
        }
    };

    // Handle video deletion
    const handleDeleteVideo = async () => {
        if (!uploadedFilename) {
            setUploadMessage('No video to delete.');
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:5000/api/delete-video/${uploadedFilename}`);
            if (response.status === 200) {
                setUploadMessage('Video deleted successfully!');
                setUploadedVideoUrl(null); // Clear the video preview
                setUploadedFilename(''); // Clear the filename
            } else {
                setUploadMessage('Failed to delete video. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting video:', error);
            setUploadMessage('Error deleting video. Please try again.');
        }
    };

    return (
        <div className="admin-page">
            <center>
                <h2>Admin - Upload Video</h2>
                <input type="file" accept="video/*" onChange={handleFileChange} name="videoUpload" />
                <button onClick={handleFileUpload}>Upload Video</button>
                <p>{uploadMessage}</p>

                {/* Display the uploaded video */}
                {uploadedVideoUrl && (
                    <div className="video-preview">
                        <h3>Uploaded Video Preview:</h3>
                        <video width="600" controls>
                            <source src={uploadedVideoUrl} type="video/mp4" />
                            <track kind="captions" src="http://localhost:3000/subtitles_en.vtt" />
                            Your browser does not support the video tag.
                        </video>
                        <button onClick={handleDeleteVideo}>Delete Video</button>
                    </div>
                )}
            </center>

            <style>{`
            .admin-page {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 20px;
              min-height: 100vh;
              background-color: #f4f4f4;
              color: #333;
            }

            .admin-page h2 {
              margin-bottom: 20px;
            }

            .admin-page input[type="file"] {
              margin-bottom: 20px;
            }

            .admin-page button {
              padding: 10px 20px;
              border: none;
              background-color: #007bff;
              color: #fff;
              border-radius: 4px;
              cursor: pointer;
              transition: background-color 0.3s;
            }

            .admin-page button:hover {
              background-color: #0056b3;
            }

            .video-preview {
              margin-top: 20px;
            }

            .video-preview h3 {
              margin-bottom: 10px;
            }

            video {
              border: 2px solid #333;
              border-radius: 8px;
            }
            `}</style>
        </div>
    );
}

export default UploadVideo;
