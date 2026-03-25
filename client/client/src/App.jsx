import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './services/api';
import Login from './components/Login';
import Wallet from './components/Wallet';
import GameBoard from './components/GameBoard';
import AdminPanel from './components/AdminPanel';

const styles = {
    app: { minHeight: '100vh', background: '#f3f4f6', display: 'flex', flexDirection: 'column' },
    header: { background: '#667eea', color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
    userInfo: { display: 'flex', gap: '1rem', alignItems: 'center' },
    logoutBtn: { padding: '0.4rem 0.8rem', borderRadius: '5px', border: 'none', background: '#e53e3e', color: '#fff', cursor: 'pointer' },
    main: { flex: 1, padding: '2rem' },
    loadingContainer: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }
};

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await authAPI.me();
                setUser(response.data);
            }
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (userData) => {
        localStorage.setItem('token', userData.token);
        setUser(userData.user);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    if (loading) return <div style={styles.loadingContainer}>Loading...</div>;

    return (
        <Router>
            <div style={styles.app}>
                <header style={styles.header}>
                    <h1>🎮 Betting Card Match </h1>
                    {user && (
                        <div style={styles.userInfo}>
                            <span>👤 {user.username} {user.isAdmin && "(Admin)"}</span>
                            <span style={{ fontWeight: 'bold' }}>💰 Balance: ₹{user.balance?.toLocaleString()}</span>
                            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                        </div>
                    )}
                </header>

                <main style={styles.main}>
                    <Routes>
                        <Route path="/" element={user ? <Navigate to={user.isAdmin ? "/admin" : "/wallet"} /> : <Login onLogin={handleLogin} />} />
                        
                        <Route path="/admin" element={
                            user?.isAdmin ? <AdminPanel user={user} updateUser={updateUser} /> : <Navigate to="/login" />
                        } />

                        <Route path="/wallet" element={
                            user && !user.isAdmin ? (
                                <>
                                    <Wallet user={user} updateUser={updateUser} />
                                    <GameBoard user={user} updateUser={updateUser} />
                                </>
                            ) : <Navigate to="/login" />
                        } />

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;