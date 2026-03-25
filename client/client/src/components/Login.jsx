import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const styles = {
    container: {
        maxWidth: '400px',
        margin: '0 auto',
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
    inputGroup: {
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '0.3rem',
        fontWeight: '500',
    },
    input: {
        padding: '0.5rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        width: '100%',
        padding: '0.7rem',
        borderRadius: '5px',
        border: 'none',
        background: '#667eea',
        color: '#fff',
        cursor: 'pointer',
        marginTop: '1rem',
    },
    toggleContainer: {
        textAlign: 'center',
        marginTop: '1rem',
    },
    toggleButton: {
        background: 'none',
        border: 'none',
        color: '#667eea',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontSize: '1rem',
    },
    adminBox: {
        marginTop: '1.5rem',
        padding: '1rem',
        background: '#fff3cd',
        borderRadius: '8px',
        fontSize: '0.9rem',
        borderLeft: '4px solid #ffc107',
    }
};

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = isLogin
                ? await authAPI.login(formData)
                : await authAPI.signup(formData);

            localStorage.setItem('token', response.data.token);

            localStorage.setItem('user', JSON.stringify(response.data.user));

            onLogin(response.data);

            navigate('/wallet');
        } catch (error) {
            alert(error.response?.data?.error || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Username</label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                            setFormData({ ...formData, username: e.target.value })
                        }
                        placeholder="Enter username"
                        required
                        disabled={loading}
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="Enter password"
                        required
                        disabled={loading}
                        style={styles.input}
                    />
                </div>

                <button
                    type="submit"
                    style={styles.button}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>

            <div style={styles.toggleContainer}>
                <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    disabled={loading}
                    style={styles.toggleButton}
                >
                    {isLogin
                        ? 'Need an account? Sign Up'
                        : 'Have an account? Login'}
                </button>
            </div>

            
        </div>
    );
};

export default Login;