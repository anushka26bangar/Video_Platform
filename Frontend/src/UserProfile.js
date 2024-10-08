import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserProfile() {
    const [userData, setUserData] = useState(null);
    const email = localStorage.getItem('email'); // Fetch the user email from localStorage

    useEffect(() => {
        const fetchUserData = async () => {
            if (!email) {
                console.error('User email is null or undefined.');
                return; // Exit if email is not available
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/user/${email}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [email]);

    return (
        <div>
            {userData ? (
                <div>
                    <h2>User Profile</h2>
                    <p>Email: {userData.email}</p>
                    <p>Name: {userData.name}</p>
                    {/* Add other user details as needed */}
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
}

export default UserProfile;
