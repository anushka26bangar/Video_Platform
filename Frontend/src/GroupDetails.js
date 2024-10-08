import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function GroupDetails() {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const currentUserId = 1; // Replace with the actual logged-in user ID
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Group ID:", groupId);
        fetch(`http://localhost:5000/api/groups/${groupId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Group not found');
            }
            return response.json();
        })
        .then((data) => setGroup(data))
        .catch((error) => console.error('Error fetching group details:', error));
    }, [groupId]);    
    
    const handleJoinGroup = () => {
        fetch(`http://localhost:5000/api/groups/${groupId}/join`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer your-token' // Check if the server allows this header
            },
            body: JSON.stringify({ user_id: currentUserId }),
            mode: 'cors' // Optional
        })
        .then(response => {
            if (response.ok) {
                alert('Successfully joined the group!');
                // Update group details after joining
                return fetch(`http://localhost:5000/api/groups/${groupId}`)
                    .then((response) => response.json())
                    .then((data) => setGroup(data))
                    .catch((error) => console.error('Error updating group details:', error));
            } else {
                response.json().then(data => alert(data.error));
            }
        })
        .catch(error => console.error('Error joining group:', error));
    };

    if (!group) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.groupDetailsContainer}>
            <h1 style={styles.heading}>{group.name}</h1>
            <p style={styles.description}>{group.description}</p>
            <h2 style={styles.subHeading}>Members</h2>
            <ul style={styles.memberList}>
                {group.members.map((member, index) => (
                    <li key={index} style={styles.memberItem}>{member.name}</li>
                ))}
            </ul>
            {!group.members.some(member => member.id === currentUserId) && (
                <button 
                    onClick={handleJoinGroup} 
                    style={styles.joinButton}
                >
                    Join Group
                </button>
            )}
        </div>
    );
}

const styles = {
    groupDetailsContainer: {
        padding: '20px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
    },
    heading: {
        fontSize: '3rem',
        marginBottom: '20px',
    },
    description: {
        fontSize: '1.5rem',
        marginBottom: '20px',
    },
    subHeading: {
        fontSize: '2rem',
        marginBottom: '10px',
    },
    memberList: {
        listStyleType: 'none',
        padding: 0,
    },
    memberItem: {
        fontSize: '1.5rem',
        marginBottom: '10px',
    },
    joinButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
};

export default GroupDetails;
