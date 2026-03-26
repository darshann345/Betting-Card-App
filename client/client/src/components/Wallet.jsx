import React, { useState, useEffect } from 'react';
import { walletAPI, authAPI } from '../services/api';

const Wallet = ({ user, updateUser }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = screenWidth < 600;
    const isTablet = screenWidth >= 600 && screenWidth < 900;

    const netProfit =
        (user.totalWinnings || 0) -
        ((user.totalDeposited || 0) - (user.balance || 0));

    const quickAmounts = [100, 500, 1000, 2000];

    const styles = {
        container: {
            maxWidth: isMobile ? '100%' : '900px',
            margin: '0 auto',
            padding: isMobile ? '15px' : '25px',
        },
        header: {
            textAlign: 'center',
            fontSize: isMobile ? '1.4rem' : isTablet ? '1.6rem' : '1.8rem',
            marginBottom: '20px',
            color: '#1a202c',
        },
        balanceCard: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            textAlign: 'center',
            padding: isMobile ? '20px' : '30px',
            borderRadius: '20px',
            marginBottom: '20px',
            boxShadow: '0 10px 20px rgba(102,126,234,0.3)',
        },
        balanceLabel: {
            fontSize: '0.9rem',
            opacity: 0.9,
            textTransform: 'uppercase',
            letterSpacing: '1px',
        },
        balanceAmount: {
            fontSize: isMobile ? '2rem' : '3rem',
            fontWeight: '800',
            margin: '0.5rem 0',
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile
                ? '1fr 1fr'
                : isTablet
                    ? '1fr 1fr'
                    : '1fr 1fr 1fr 1fr',
            gap: '15px',
            marginBottom: '20px',
        },
        statBox: {
            background: '#f8fafc',
            padding: '15px',
            borderRadius: '15px',
            textAlign: 'center',
        },
        statLabel: {
            fontSize: '0.75rem',
            color: '#718096',
            marginBottom: '0.3rem',
            display: 'block',
        },
        statValue: {
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#2d3748',
        },
        green: { color: '#48bb78' },
        red: { color: '#f56565' },
        quickButtons: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '15px',
        },
        quickBtn: {
            padding: '10px 15px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            background: '#fff',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s',
        },
        activeQuickBtn: {
            background: '#667eea',
            color: '#fff',
            borderColor: '#667eea',
        },
        input: {
            width: '100%',
            padding: '15px',
            borderRadius: '12px',
            border: '1px solid #ddd',
            textAlign: 'center',
            marginBottom: '15px',
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box',
        },
        buttonGroup: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '10px',
        },
        primaryBtn: {
            flex: 1,
            padding: '15px',
            background: '#667eea',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '700',
        },
        secondaryBtn: {
            flex: 1,
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '10px',
            background: '#fff',
            cursor: 'pointer',
            fontWeight: '700',
        },
        footer: {
            textAlign: 'center',
            fontSize: '12px',
            marginTop: '15px',
            color: 'gray',
        },
    };

    const handleTransaction = async (type) => {
        const val = parseInt(amount);
        if (!amount || val < 10) {
            alert('Minimum amount is ₹10');
            return;
        }

        if (type === 'withdraw' && val > user.balance) {
            alert('Insufficient balance');
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
            alert(response.data.message || 'Transaction Successful!');
        } catch (error) {
            alert(error.response?.data?.error || 'Transaction Failed');
        } finally {
            setLoading(false);
        }
    };

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
                    <span style={styles.statValue}>
                        ₹{user.totalDeposited?.toLocaleString() || 0}
                    </span>
                </div>

                <div style={styles.statBox}>
                    <span style={styles.statLabel}>Total Winnings</span>
                    <span style={{ ...styles.statValue, ...styles.green }}>
                        ₹{user.totalWinnings?.toLocaleString() || 0}
                    </span>
                </div>

                <div style={styles.statBox}>
                    <span style={styles.statLabel}>Win %</span>
                    <span style={styles.statValue}>
                        {user.gamesPlayed > 0
                            ? ((user.gamesWon / user.gamesPlayed) * 100).toFixed(0)
                            : 0}
                        %
                    </span>
                </div>

                <div style={styles.statBox}>
                    <span style={styles.statLabel}>Net Profit</span>
                    <span
                        style={{
                            ...styles.statValue,
                            ...(netProfit >= 0 ? styles.green : styles.red),
                        }}
                    >
                        {netProfit >= 0 ? '+' : ''}
                        ₹{netProfit.toLocaleString()}
                    </span>
                </div>
            </div>

            <div style={styles.quickButtons}>
                {quickAmounts.map((val) => (
                    <button
                        key={val}
                        onClick={() => setAmount(val.toString())}
                        style={{
                            ...styles.quickBtn,
                            ...(amount === val.toString() ? styles.activeQuickBtn : {}),
                        }}
                    >
                        +₹{val}
                    </button>
                ))}
            </div>

            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                style={styles.input}
            />

            <div style={styles.buttonGroup}>
                <button
                    style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1 }}
                    onClick={() => handleTransaction('deposit')}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Deposit'}
                </button>

                <button
                    style={{
                        ...styles.secondaryBtn,
                        opacity: loading || !user.balance ? 0.7 : 1,
                    }}
                    onClick={() => handleTransaction('withdraw')}
                    disabled={loading || !user.balance}
                >
                    Withdraw
                </button>
            </div>

            <p style={styles.footer}>Instant withdrawals. Minimum ₹10.</p>
        </div>
    );
};

export default Wallet;