import React, { useState } from 'react';
import { walletAPI, authAPI } from '../services/api';

const styles = {
    container: {
        maxWidth: '500px',
        margin: '0 auto 2rem',
        background: '#ffffff',
        padding: '2rem',
        borderRadius: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: '#1a202c',
    },
    balanceCard: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        borderRadius: '24px',
        color: '#fff',
        textAlign: 'center',
        marginBottom: '2rem',
        boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)',
    },
    balanceLabel: {
        fontSize: '0.9rem',
        opacity: 0.9,
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    balanceAmount: {
        fontSize: '3rem',
        fontWeight: '800',
        margin: '0.5rem 0',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '2rem',
    },
    statBox: {
        background: '#f8fafc',
        padding: '1.2rem',
        borderRadius: '18px',
        textAlign: 'center',
        border: '1px solid #edf2f7',
    },
    statLabel: {
        fontSize: '0.75rem',
        color: '#718096',
        display: 'block',
        marginBottom: '0.3rem',
    },
    statValue: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#2d3748',
    },
    actionSection: {
        marginTop: '1.5rem',
    },
    quickDeposits: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        marginBottom: '1.5rem',
        justifyContent: 'center'
    },
    quickBtn: {
        padding: '0.6rem 1rem',
        borderRadius: '12px',
        border: '2px solid #edf2f7',
        background: '#fff',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.2s',
    },
    activeQuickBtn: {
        background: '#f0f4ff',
        borderColor: '#667eea',
        color: '#667eea',
    },
    inputWrapper: {
        position: 'relative',
        marginBottom: '1.5rem',
    },
    input: {
        width: '100%',
        padding: '16px',
        borderRadius: '15px',
        border: '2px solid #edf2f7',
        fontSize: '1.1rem',
        outline: 'none',
        boxSizing: 'border-box',
        textAlign: 'center',
        transition: 'border-color 0.2s',
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
    },
    primaryBtn: {
        flex: 1,
        padding: '16px',
        borderRadius: '15px',
        border: 'none',
        background: '#667eea',
        color: '#fff',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    secondaryBtn: {
        flex: 1,
        padding: '16px',
        borderRadius: '15px',
        border: '2px solid #e2e8f0',
        background: '#fff',
        color: '#4a5568',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
    }
};

const Wallet = ({ user, updateUser }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const netProfit = (user.totalWinnings || 0) - ((user.totalDeposited || 0) - (user.balance || 0));

    const handleTransaction = async (type) => {
        const val = parseInt(amount);
        if (!amount || val < 10) {
            alert('Minimum amount is ₹10');
            return;
        }

        if (type === 'withdraw' && val > user.balance) {
            alert('Insufficient balance for withdrawal');
            return;
        }

        setLoading(true);
        try {
            let response;
            if (type === 'deposit') {
                response = await walletAPI.deposit(val);
            } else {
                response = await walletAPI.withdraw(val);
            }

            const freshUser = await authAPI.me();
            updateUser(freshUser.data);
            
            setAmount('');
            alert(response.data.message || 'Transaction successful!');
        } catch (error) {
            alert(error.response?.data?.error || 'Transaction failed');
        } finally {
            setLoading(false);
        }
    };

    const quickAmounts = [100, 500, 1000, 2000];

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Wallet Dashboard</h2>

            <div style={styles.balanceCard}>
                <span style={styles.balanceLabel}>Available Funds</span>
                <h1 style={styles.balanceAmount}>
                    ₹{user.balance?.toLocaleString() || 0}
                </h1>
            </div>

            <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                    <span style={styles.statLabel}>Lifetime Deposit</span>
                    <span style={styles.statValue}>₹{user.totalDeposited?.toLocaleString() || 0}</span>
                </div>
                <div style={styles.statBox}>
                    <span style={styles.statLabel}>Total Winnings</span>
                    <span style={{ ...styles.statValue, color: '#48bb78' }}>
                        ₹{user.totalWinnings?.toLocaleString() || 0}
                    </span>
                </div>
                <div style={styles.statBox}>
                    <span style={styles.statLabel}>Win/Loss Ratio</span>
                    <span style={styles.statValue}>
                        {user.gamesPlayed > 0 ? ((user.gamesWon / user.gamesPlayed) * 100).toFixed(0) : 0}%
                    </span>
                </div>
                <div style={styles.statBox}>
                    <span style={styles.statLabel}>Net Profit</span>
                    <span style={{ 
                        ...styles.statValue, 
                        color: netProfit >= 0 ? '#48bb78' : '#f56565' 
                    }}>
                        {netProfit >= 0 ? '+' : ''}₹{netProfit.toLocaleString()}
                    </span>
                </div>
            </div>

            <div style={styles.actionSection}>
                <div style={styles.quickDeposits}>
                    {quickAmounts.map(val => (
                        <button
                            key={val}
                            onClick={() => setAmount(val.toString())}
                            style={{
                                ...styles.quickBtn,
                                ...(amount === val.toString() ? styles.activeQuickBtn : {})
                            }}
                        >
                            +₹{val}
                        </button>
                    ))}
                </div>

                <div style={styles.inputWrapper}>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter custom amount"
                        style={styles.input}
                        min="10"
                    />
                </div>

                <div style={styles.buttonGroup}>
                    <button
                        onClick={() => handleTransaction('deposit')}
                        style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1 }}
                        disabled={loading}
                    >
                        {loading && amount ? 'Processing...' : 'Deposit'}
                    </button>
                    <button
                        onClick={() => handleTransaction('withdraw')}
                        style={{ ...styles.secondaryBtn, opacity: loading ? 0.7 : 1 }}
                        disabled={loading || !user.balance || user.balance < 10}
                    >
                        Withdraw
                    </button>
                </div>
            </div>
            
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#a0aec0', marginTop: '1.5rem' }}>
                Instant withdrawals to linked accounts. Minimum ₹10.
            </p>
        </div>
    );
};

export default Wallet;