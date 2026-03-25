import React, { useState, useEffect } from 'react';
import { adminAPI, authAPI } from '../services/api';

const styles = {
    adminPanel:
    {
        display: 'flex',
        flexDirection: 'column', 
        gap: '2rem'
    },
    card:
    {
        background: '#ffffff',
        padding: '1.5rem', borderRadius: '15px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    },
    statsGrid:
    {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem', 
        marginTop: '1rem'
    },
    statCard:
        { background: 'linear-gradient(135deg, #667eea, #764ba2)', 
            color: '#fff',
             padding: '1.5rem', 
             borderRadius: '15px', 
             textAlign: 'center' 
        },
    profitCard:
    {
        background:'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        padding: '1.5rem', borderRadius: '15px', textAlign: 'center'
    },
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0 10px', 
        marginTop: '1.5rem'
    },

    th: {
        textAlign: 'left',
        padding: '14px',
        background: '#667eea',
        color: '#fff',
        fontWeight: '600',
        fontSize: '0.9rem',
        letterSpacing: '0.5px',
    },

    td: {
        textAlign : 'left',
        padding: '14px',
        background: '#ffffff',
        borderBottom: '1px solid #f1f5f9',
        fontSize: '0.95rem',
    },

    row: {
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        borderRadius: '10px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
    },

    rowHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
    },
    button: { padding: '6px 12px', cursor: 'pointer', background: '#667eea', color: '#fff', border: 'none', borderRadius: '5px' }
};

const AdminPanel = ({ user, updateUser }) => {
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [newBalance, setNewBalance] = useState('');

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const statsRes = await adminAPI.stats();
            setStats(statsRes.data);

            const usersRes = await adminAPI.users();
            setUsers(usersRes.data); // Backend now only sends players

            const me = await authAPI.me();
            updateUser(me.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await adminAPI.updateBalance(editingUser._id, parseInt(newBalance));
            setEditingUser(null);
            fetchData();
        } catch (e) { alert("Failed"); }
    };

    return (
        <div style={styles.adminPanel}>
            <div style={styles.card}>
                <h2>Admin Dashboard</h2>
                <div style={styles.statsGrid}>
                    <div style={styles.profitCard}>
                        <h3>₹{user.balance?.toLocaleString()}</h3>
                        <p>My Personal Balance (Profits)</p>
                    </div>

                    <div style={styles.statCard}>
                        <h3>₹{stats.totalBalance?.toLocaleString() || 0}</h3>
                        <p>Total Player Balances</p>
                    </div>

                    <div style={styles.statCard}>
                        <h3>{stats.totalUsers || 0}</h3>
                        <p>Total Players</p>
                    </div>
                </div>
            </div>

            <div style={styles.card}>
                <h2>Manage Players</h2>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Username</th>
                            <th style={styles.th}>Wallet</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td style={styles.td}>{u.username}</td>
                                <td style={styles.td}>₹{u.balance.toLocaleString()}</td>
                                <td style={styles.td}>
                                    <button style={styles.button} onClick={() => { setEditingUser(u); setNewBalance(u.balance) }}>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {editingUser && (
                    <div style={{ marginTop: '20px', padding: '15px', background: '#f0f4f8', borderRadius: '10px' }}>
                        <h4>Set Balance for {editingUser.username}</h4>
                        <input
                            type="number" value={newBalance}
                            onChange={(e) => setNewBalance(e.target.value)}
                            style={{ padding: '8px', marginRight: '10px' }}
                        />
                        <button style={styles.button} onClick={handleUpdate}>Save</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;