import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSave } from 'react-icons/fa'; // Import react-icons

function CreateGroupAdmin() {
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [members, setMembers] = useState([{ name: '' }, { name: '' }]);
    const [isGroupNameUnique, setIsGroupNameUnique] = useState(true);
    const navigate = useNavigate();

    // Check if group name is unique before submission
    const validateGroupName = async () => {
        const response = await fetch(`http://localhost:5000/api/admin/groups?name=${groupName}`);
        const data = await response.json();
        return data.length === 0; // Check if no group with the same name exists
    };

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
        console.log('Submit button clicked');

        const isUnique = await validateGroupName();

        if (!isUnique) {
            alert('Group name already exists. Please choose another name.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/admin/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupName, description, members })
            });

            if (response.ok) {
                alert('Group created successfully!');
                navigate('/admin/manage-groups');
            } else {
                alert('Error creating group.');
            }
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    return (
        <div style={styles.groupFormContainer}>
            <h1 style={styles.heading}>Create a Group</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.input}
                    required
                />
                <h3 style={styles.subHeading}>Group Members</h3>
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
                                style={styles.removeMemberButton}
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
                        style={styles.addMemberButton}
                    >
                        <FaUserPlus style={styles.icon} /> Add Member
                    </button>
                )}
                <button type="submit" style={styles.submitButton}>
                    <FaSave style={styles.icon} /> Create Group
                </button>
            </form>
        </div>
    );
}

const styles = {
    groupFormContainer: {
        padding: '20px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        color: 'black',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
    },
    heading: {
        fontSize: '3rem',
        marginBottom: '30px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    input: {
        padding: '15px',
        fontSize: '1.5rem',
        border: 'none',
        borderRadius: '8px',
        marginBottom: '15px',
        width: '100%',
        maxWidth: '500px',
    },
    subHeading: {
        fontSize: '2rem',
        marginBottom: '20px',
    },
    memberContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    },
    addMemberButton: {
        padding: '15px 30px',
        fontSize: '1.5rem',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#28a745',
        color: 'white',
        cursor: 'pointer',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
    },
    removeMemberButton: {
        padding: '10px',
        fontSize: '1.2rem',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#dc3545',
        color: 'white',
        cursor: 'pointer',
        marginLeft: '10px',
    },
    submitButton: {
        padding: '15px 30px',
        fontSize: '1.5rem',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        marginRight: '10px',
    },
};

export default CreateGroupAdmin;