import React, { useState, useEffect } from 'react';
import { adminAPI, authAPI } from '../services/api';

const styles = {
    adminPanel: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        padding: '1rem'
    },

    card: {
        background: '#ffffff',
        padding: '1.5rem',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },

    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginTop: '1rem',
    },

    statCard: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: '#fff',
        padding: '1.2rem',
        borderRadius: '12px',
        textAlign: 'center',
    },

    profitCard: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        padding: '1.2rem',
        borderRadius: '12px',
        textAlign: 'center',
    },

    tableWrapper: {
        width: '100%',
        overflowX: 'auto', // ✅ scroll on mobile
    },

    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0 10px',
        minWidth: '500px', // ensures scroll instead of breaking
    },

    th: {
        textAlign: 'left',
        padding: '12px',
        background: '#667eea',
        color: '#fff',
        fontWeight: '600',
        fontSize: '0.85rem',
    },

    td: {
        textAlign: 'left',
        padding: '12px',
        background: '#ffffff',
        borderBottom: '1px solid #f1f5f9',
        fontSize: '0.9rem',
    },

    button: {
        padding: '6px 12px',
        cursor: 'pointer',
        background: '#667eea',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
    },

    editBox: {
        marginTop: '20px',
        padding: '15px',
        background: '#f0f4f8',
        borderRadius: '10px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center'
    },

    input: {
        padding: '8px',
        flex: '1',
        minWidth: '120px'
    }
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
            setUsers(usersRes.data);

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
        } catch (e) {
            alert("Failed");
        }
    };

    return (
        <div style={styles.adminPanel}>

            {/* Dashboard */}
            <div style={styles.card}>
                <h2>Admin Dashboard</h2>

                <div style={styles.statsGrid}>
                    <div style={styles.profitCard}>
                        <h3>₹{user.balance?.toLocaleString()}</h3>
                        <p>My Profit</p>
                    </div>

                    <div style={styles.statCard}>
                        <h3>₹{stats.totalBalance?.toLocaleString() || 0}</h3>
                        <p>Total Player Balance</p>
                    </div>

                    <div style={styles.statCard}>
                        <h3>{stats.totalUsers || 0}</h3>
                        <p>Total Players</p>
                    </div>
                </div>
            </div>

            {/* Users */}
            <div style={styles.card}>
                <h2>Manage Players</h2>

                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Username</th>
                                <th style={styles.th}>Wallet</th>
                                <th style = {styles.th}>Withdraw</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td style={styles.td}>{u.username}</td>
                                    <td style={styles.td}>₹{u.balance.toLocaleString()}</td>
                                    <td style = {styles.td}>₹{u.totalWithdrawn.toLocaleString()}</td>
                                    <td style={styles.td}>
                                        <button
                                            style={styles.button}
                                            onClick={() => {
                                                setEditingUser(u);
                                                setNewBalance(u.balance);
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {editingUser && (
                    <div style={styles.editBox}>
                        <h4 style={{ width: '100%' }}>
                            Set Balance for {editingUser.username}
                        </h4>

                        <input
                            type="number"
                            value={newBalance}
                            onChange={(e) => setNewBalance(e.target.value)}
                            style={styles.input}
                        />

                        <button style={styles.button} onClick={handleUpdate}>
                            Save
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;