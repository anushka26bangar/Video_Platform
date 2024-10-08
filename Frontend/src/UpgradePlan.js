import React, { useState } from 'react';
import { FaUserCheck } from 'react-icons/fa';

function UpgradePlan() {
    const [message, setMessage] = useState('');
    const [isUserValid] = useState(true); // Directly set to true since users are logged in

    const handleUpgradePlan = async (planType) => {
        if (!isUserValid) {
            setMessage('Please check if the user exists.');
            return;
        }

        // Navigate to the respective plan page (replace with your actual routes)
        switch (planType) {
            case 'bronze':
                window.location.href = 'https://rzp.io/rzp/zmXoYjH'; // URL for Bronze Plan page
                break;
            case 'silver':
                window.location.href = 'https://rzp.io/rzp/URXhgSg'; // URL for Silver Plan page
                break;
            case 'gold':
                window.location.href = 'https://rzp.io/rzp/0wT6EQi'; // URL for Gold Plan page
                break;
            default:
                break;
        }
    };

    return (
        <div style={styles.upgradePlanContainer}>
            <h1 style={styles.heading}>Upgrade Your Plan</h1>
            <div style={styles.plans}>
                <div style={{ ...styles.planBox, ...styles.bronze }}>
                    <h2>Bronze Plan</h2>
                    <p>₹10 / 7 minutes</p>
                    <button
                        onClick={() => handleUpgradePlan('bronze')} // Link to Bronze Plan page
                        style={isUserValid ? { ...styles.button, ...styles.enabledButton } : { ...styles.button, ...styles.disabledButton }}
                        disabled={!isUserValid}
                    >
                        Buy Plan
                    </button>
                </div>
                <div style={{ ...styles.planBox, ...styles.silver }}>
                    <h2>Silver Plan</h2>
                    <p>₹50 / 10 minutes</p>
                    <button
                        onClick={() => handleUpgradePlan('silver')} // Link to Silver Plan page
                        style={isUserValid ? { ...styles.button, ...styles.enabledButton } : { ...styles.button, ...styles.disabledButton }}
                        disabled={!isUserValid}
                    >
                        Buy Plan
                    </button>
                </div>
                <div style={{ ...styles.planBox, ...styles.gold }}>
                    <h2>Gold Plan</h2>
                    <p>₹100 / Unlimited</p>
                    <button
                        onClick={() => handleUpgradePlan('gold')} // Link to Gold Plan page
                        style={isUserValid ? { ...styles.button, ...styles.enabledButton } : { ...styles.button, ...styles.disabledButton }}
                        disabled={!isUserValid}
                    >
                        Buy Plan
                    </button>
                </div>
            </div>
            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
}

const styles = {
    upgradePlanContainer: {
        textAlign: 'center',
        padding: '50px 20px',
        background: 'linear-gradient(120deg, #2c3e50, #4c5c68)', // Dark gradient background
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        color: '#f0f0f0', // Light text color for dark background
    },
    heading: {
        fontSize: '2.5rem',
        marginBottom: '30px',
        color: '#ecf0f1', // Light heading color
    },
    plans: {
        display: 'flex',
        justifyContent: 'center',
        gap: '25px',
        flexWrap: 'wrap',
        marginTop: '20px',
    },
    planBox: {
        width: '250px',
        padding: '30px 20px',
        borderRadius: '10px',
        color: '#fff',
        textAlign: 'center',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    },
    bronze: {
        backgroundColor: '#cd7f32',
    },
    silver: {
        backgroundColor: '#c0c0c0',
    },
    gold: {
        backgroundColor: '#ffd700',
    },
    button: {
        marginTop: '20px',
        padding: '10px 15px',
        fontSize: '1.1rem',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background 0.3s',
        color: '#fff',
    },
    enabledButton: {
        background: '#2980b9',
    },
    disabledButton: {
        background: '#bdc3c7',
        cursor: 'not-allowed',
    },
    message: {
        marginTop: '20px',
        fontSize: '1rem',
        color: '#e74c3c',
    },
};

export default UpgradePlan;
