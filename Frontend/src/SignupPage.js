import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false); // Ensure loading is defined
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/signup', {
                name,
                email,
                password,
                confirm_password: confirmPassword,
                phone_number: phoneNumber,
            });
            if (response.data.message) {
                setMessage(response.data.message);
                setError(null);
                setTimeout(() => {
                    setLoading(false);
                    navigate('/login');
                }, 1500);
            } else {
                setError(response.data.error);
                setMessage(null);
                setLoading(false);
            }
        } catch (error) {
            setError('Error signing up');
            setMessage(null);
            setLoading(false);
        }
    };

    return (
        <div style={styles.authContainer}>
            <h2 style={styles.heading}>Sign Up</h2>
            <form onSubmit={handleSignup} style={styles.form}>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    style={styles.input}
                    className="animated-input"
                />
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
                    className="animated-input"
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    style={styles.input}
                    className="animated-input"
                />
                <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    style={styles.input}
                    className="animated-input"
                />
                <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    placeholder="Phone Number (optional)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    autoComplete="tel"
                    style={styles.input}
                    className="animated-input"
                />
                <button
                    type="submit"
                    style={{
                        ...styles.button,
                        backgroundColor: loading ? '#ccc' : '#007bff',
                    }}
                    disabled={loading}
                >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
            {message && <p style={styles.successMessage}>{message}</p>}
            {error && <p style={styles.errorMessage}>{error}</p>}
            <p style={styles.paragraph}>
                Already have an account? <a href="/login" style={styles.link}>Log in here</a>
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
        backgroundColor: '#e6f7ff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        marginBottom: '30px',
        fontSize: '2.8rem',
        color: '#0056b3',
        fontFamily: 'Arial, sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        marginBottom: '15px',
        padding: '12px',
        border: '2px solid #ccc',
        borderRadius: '5px',
        width: '100%',
        maxWidth: '350px',
        fontSize: '1rem',
        transition: 'border-color 0.3s',
    },
    button: {
        padding: '10px 25px',
        border: 'none',
        borderRadius: '5px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '1.2rem',
        marginTop: '20px',
        transition: 'background-color 0.3s',
    },
    successMessage: {
        color: 'green',
        fontSize: '1.2rem',
        marginTop: '10px',
    },
    errorMessage: {
        color: 'red',
        fontSize: '1.2rem',
        marginTop: '10px',
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

export default SignupPage;
