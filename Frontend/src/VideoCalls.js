import React, { useRef, useState } from 'react';
import { FaPhoneAlt, FaPhoneSlash, FaDesktop, FaStopCircle, FaSave, FaUserPlus } from 'react-icons/fa'; // Importing icons

function VideoCall() {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [screenStream, setScreenStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [showInvitePrompt, setShowInvitePrompt] = useState(false);

    const startCall = async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = localStream;
        setStream(localStream);

        const pc = new RTCPeerConnection();
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        pc.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        setPeerConnection(pc);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                // Handle ICE candidates
            }
        };

        const recorder = new MediaRecorder(localStream);
        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                setRecordedChunks((prev) => prev.concat(event.data));
            }
        };
        recorder.start();
        setMediaRecorder(recorder);
    };

    const startScreenShare = async () => {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(screenStream);

        const videoTrack = screenStream.getVideoTracks()[0];
        const senders = peerConnection.getSenders();
        const videoSender = senders.find(sender => sender.track.kind === 'video');
        videoSender.replaceTrack(videoTrack);

        screenStream.getTracks()[0].onended = () => {
            stopScreenShare();
        };
    };

    const stopScreenShare = () => {
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
            setScreenStream(null);

            const videoTrack = stream.getVideoTracks()[0];
            const senders = peerConnection.getSenders();
            const videoSender = senders.find(sender => sender.track.kind === 'video');
            videoSender.replaceTrack(videoTrack);
        }
    };

    const stopCall = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
        if (peerConnection) {
            peerConnection.close();
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
        }
    };

    const saveRecording = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recording.webm';
        a.click();
    };

    const inviteUser = () => {
        // Placeholder for invite logic
        console.log(`Inviting user with email: ${inviteEmail}`);
        setShowInvitePrompt(false);
        setInviteEmail('');
    };

    return (
        <div style={styles.videoCallContainer}>
            <div style={styles.videoSection}>
                <video ref={localVideoRef} autoPlay muted style={styles.videoElement}>
                    <track kind="captions" srcLang="en" />
                </video>
                <video ref={remoteVideoRef} autoPlay style={styles.videoElement}>
                    <track kind="captions" srcLang="en" />
                </video>
            </div>
            <div style={styles.buttonContainer}>
                <button onClick={startCall} style={styles.startCallButton}>
                    <FaPhoneAlt style={styles.icon} /> Start Call
                </button>
                <button onClick={stopCall} style={styles.stopCallButton}>
                    <FaPhoneSlash style={styles.icon} /> Stop Call
                </button>
                <button onClick={startScreenShare} style={styles.screenShareButton}>
                    <FaDesktop style={styles.icon} /> Share Screen
                </button>
                <button onClick={stopScreenShare} style={styles.stopScreenShareButton}>
                    <FaStopCircle style={styles.icon} /> Stop Screen Share
                </button>
                <button onClick={saveRecording} style={styles.saveButton}>
                    <FaSave style={styles.icon} /> Save Recording
                </button>
                <button onClick={() => setShowInvitePrompt(true)} style={styles.inviteButton}>
                    <FaUserPlus style={styles.icon} /> Invite
                </button>
            </div>

            {showInvitePrompt && (
                <div style={styles.invitePrompt}>
                    <h4>Invite a User</h4>
                    <input 
                        type="email" 
                        placeholder="Enter email or username"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        style={styles.inviteInput}
                    />
                    <button onClick={inviteUser} style={styles.sendInviteButton}>Send Invite</button>
                    <button onClick={() => setShowInvitePrompt(false)} style={styles.cancelInviteButton}>Cancel</button>
                </div>
            )}
        </div>
    );
}

const styles = {
    videoCallContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        backgroundColor: '#2C3E50',
        height: '100vh',
        color: '#fff',
    },
    videoSection: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: '20px',
    },
    videoElement: {
        width: '45%',
        height: '300px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#000',
    },
    buttonContainer: {
        display: 'flex',
        gap: '20px',
    },
    icon: {
        marginRight: '8px',
    },
    startCallButton: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
    },
    stopCallButton: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
    },
    screenShareButton: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
    },
    stopScreenShareButton: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#ffc107',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
    },
    saveButton: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#17a2b8',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
    },
    inviteButton: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#6f42c1', // Purple color for invite
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
    },
    invitePrompt: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#34495e',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        position: 'absolute', // Adjust positioning as needed
        zIndex: 1000, // Ensure it appears on top
    },
    inviteInput: {
        marginBottom: '10px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '200px',
    },
    sendInviteButton: {
        padding: '8px 16px',
        fontSize: '14px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    cancelInviteButton: {
        padding: '8px 16px',
        fontSize: '14px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    },
};

export default VideoCall;
