import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GroupList() {
    const [groups, setGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const currentUserId = 1; // Replace with actual logged-in user ID
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/groups')
            .then((response) => response.json())
            .then((data) => setGroups(data))
            .catch((error) => console.error('Error fetching groups:', error));
    }, []);

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            alert('Please enter a group name to search.');
            return;
        }

        const filteredGroups = groups.filter(group =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchResult(filteredGroups);
    };

    const handleViewGroup = (groupId) => {
        navigate(`/group/${groupId}`); // Navigate to the group details page
    };

    return (
        <div style={styles.groupListContainer}>
            <h1 style={styles.heading}>Groups</h1>
            <div style={styles.searchContainer}>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={styles.searchInput}
                />
                <button onClick={handleSearch} style={styles.searchButton}>Search</button>
            </div>
            <h3 style={styles.subHeading}>Groups List</h3>
            <ul style={styles.groupList}>
                {(searchResult.length > 0 ? searchResult : groups).map(group => (
                    <li key={group.group_id} style={styles.groupItem}>
                        {group.name}: {group.description}
                        <br />
                        <button 
                            onClick={() => handleViewGroup(group.group_id)} 
                            style={styles.viewButton}
                        >
                            View Group
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const styles = {
    groupListContainer: {
        padding: '20px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
    },
    heading: {
        fontSize: '3rem',
        marginBottom: '20px',
    },
    subHeading: {
        fontSize: '2rem',
        marginBottom: '10px',
    },
    searchContainer: {
        display: 'flex',
        marginBottom: '20px',
    },
    searchInput: {
        padding: '10px',
        fontSize: '1rem',
        flexGrow: 1,
    },
    searchButton: {
        padding: '10px',
        fontSize: '1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
    groupList: {
        listStyleType: 'none',
        padding: 0,
    },
    groupItem: {
        fontSize: '1.5rem',
        marginBottom: '20px',
    },
    viewButton: {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
};

export default GroupList;
