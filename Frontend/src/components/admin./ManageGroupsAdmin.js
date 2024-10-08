import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageGroupsAdmin() {
    const [groups, setGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/admin/groups')
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
        navigate(`/admin/group/${groupId}`);
    };

    return (
        <div style={styles.groupListContainer}>
            <h1 style={styles.heading}>Manage Groups</h1>
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
                            style={styles.viewGroupButton}
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
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
    },
    heading: {
        fontSize: '3rem',
        marginBottom: '30px',
    },
    searchContainer: {
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'center',
    },
    searchInput: {
        padding: '15px',
        fontSize: '1.5rem',
        borderRadius: '8px',
        marginRight: '10px',
        width: '300px',
    },
    searchButton: {
        padding: '15px 30px',
        fontSize: '1.5rem',
        borderRadius: '8px',
        backgroundColor: '#28a745',
        color: 'white',
        cursor: 'pointer',
    },
    subHeading: {
        fontSize: '2rem',
        marginBottom: '20px',
    },
    groupList: {
        listStyle: 'none',
        padding: '0',
    },
    groupItem: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '10px',
        color: 'white',
        fontSize: '1.5rem',
    },
    viewGroupButton: {
        padding: '10px 20px',
        fontSize: '1.2rem',
        borderRadius: '8px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        marginTop: '10px',
    },
};

export default ManageGroupsAdmin;
