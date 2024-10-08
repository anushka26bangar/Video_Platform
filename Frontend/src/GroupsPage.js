import React from 'react';
import { Link } from 'react-router-dom';

function GroupsPage() {
    return (
        <div style={styles.groupsPageContainer}>
            <h1 style={styles.heading}>Groups</h1>
            <div style={styles.buttonContainer}>
                <Link to="/create-group">
                    <button style={{ ...styles.button, ...styles.blinkButton }}>Create Group</button>
                </Link>
                <Link to="/search-groups">
                    <button style={{ ...styles.button, ...styles.blinkButton }}>Search Groups</button>
                </Link>
            </div>
        </div>
    );
}

const styles = {
    groupsPageContainer: {
        padding: '20px',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: '2.5rem',
        marginBottom: '40px',
        color: '#333',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
    },
    button: {
        padding: '15px 40px',
        fontSize: '1.5rem',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.3s ease',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    blinkButton: {
        backgroundColor: '#007bff',
        color: '#fff',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
        transform: 'scale(1.05)',
    },
};

export default GroupsPage;
