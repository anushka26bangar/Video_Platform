import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email,
                password
            });
            if (response.status === 200) {
                const userData = response.data; // Assuming the response contains user data, including user_id
                const userId = userData.user_id;  // Extracting user_id from response data

                // Store user data in localStorage
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('user_id', userId); // Store the user ID
                localStorage.setItem('email', email); // Store the email

                setIsLoggedIn(true); // Update login state

                if (userData.email === 'admin@gmail.com') {
                    alert('Admin login successful');
                    navigate('/admin-home'); // Redirect to admin homepage
                } else {
                    alert('User login successful');
                    navigate('/userhome'); // Redirect to user profile page
                }
            }
        } catch (error) {
            alert('Error logging in: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={styles.authContainer}>
            <h2 style={styles.heading}>Login</h2>
            <form onSubmit={handleLogin} style={styles.form}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    style={styles.input}
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Login</button>
            </form>
            <p style={styles.paragraph}>
                Don't have an account? <a href="/signup" style={styles.link}>Sign up here</a>
            </p>
        </div>
    );
}

const styles = {
    authContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        marginBottom: '30px',
        fontSize: '2.5rem',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        marginBottom: '15px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
        maxWidth: '350px',
        fontSize: '1rem',
    },
    button: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        fontSize: '1.2rem',
    },
    paragraph: {
        marginTop: '20px',
        color: '#333',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
    },
};

export default LoginPage;
