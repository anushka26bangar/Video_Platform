import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GroupForm() {
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [members, setMembers] = useState([{ name: '' }, { name: '' }]);
    const navigate = useNavigate();

    const handleAddMember = () => {
        if (members.length < 5) {
            setMembers([...members, { name: '' }]);
        } else {
            alert('A group can have a maximum of 5 members.');
        }
    };

    const handleMemberChange = (index, event) => {
        const updatedMembers = members.map((member, i) =>
            i === index ? { ...member, name: event.target.value } : member
        );
        setMembers(updatedMembers);
    };

    const handleRemoveMember = (index) => {
        if (members.length > 2) {
            const updatedMembers = members.filter((_, i) => i !== index);
            setMembers(updatedMembers);
        } else {
            alert('You must have at least two members in the group.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const loggedInUserEmail = localStorage.getItem('userEmail');  
        
        if (!loggedInUserEmail) {
            alert("You must be logged in to create a group.");
            return;
        }
    
        const updatedMembers = [...members.map(member => member.name), loggedInUserEmail];
    
        const groupData = {
            name: groupName,
            description: description,
            created_by: loggedInUserEmail,
            members: updatedMembers,
        };
    
        try {
            const response = await fetch('http://localhost:5000/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(groupData),
            });
    
            if (response.ok) {
                alert('Group created successfully!');
                navigate('/groups');
            } else {
                const errorDetails = await response.json();
                alert(errorDetails.message || 'Error creating group.');
            }
        } catch (error) {
            console.error('Error creating group:', error);
            alert('An error occurred while creating the group.');
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Create Your Group</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Enter Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="text"
                    placeholder="Group Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.input}
                    required
                />
                <h3 style={styles.subHeading}>Add Group Members</h3>
                {members.map((member, index) => (
                    <div key={index} style={styles.memberContainer}>
                        <input
                            type="text"
                            placeholder={`Member ${index + 1}`}
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, e)}
                            style={styles.input}
                            required={index < 2}
                        />
                        {index >= 2 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveMember(index)}
                                style={styles.removeButton}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                {members.length < 5 && (
                    <button
                        type="button"
                        onClick={handleAddMember}
                        style={styles.addButton}
                    >
                        Add More Members
                    </button>
                )}
                <button type="submit" style={styles.submitButton}>
                    Create Group
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        padding: '40px',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',  // Gradient background color
        color: '#333',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        fontSize: '2.5rem',
        marginBottom: '25px',
        color: '#0056b3',  // Heading color
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    input: {
        padding: '10px',
        fontSize: '1.2rem',
        border: '2px solid #ccc',
        borderRadius: '5px',
        marginBottom: '15px',
        width: '100%',
        maxWidth: '450px',
    },
    subHeading: {
        fontSize: '1.8rem',
        marginBottom: '15px',
        color: '#0056b3',  // Subheading color
    },
    memberContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        justifyContent: 'center',
    },
    addButton: {
        padding: '10px 20px',
        fontSize: '1.2rem',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '20px',
    },
    removeButton: {
        padding: '5px 10px',
        fontSize: '1rem',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginLeft: '10px',
    },
    submitButton: {
        padding: '12px 30px',
        fontSize: '1.2rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default GroupForm;
