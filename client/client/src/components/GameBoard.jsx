import React, { useState, useEffect, useRef } from 'react';
import useGameLogic from '../hooks/useGameLogic';

const GameBoard = ({ user, updateUser }) => {
    const {
        game,
        createGame,
        handleMatch,
        betAmount,
        setBetAmount,
        isProcessing
    } = useGameLogic(updateUser);

    const [flippedIds, setFlippedIds] = useState([]);
    const [firstCard, setFirstCard] = useState(null);
    const clickLock = useRef(false);

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = screenWidth < 600;
    const isTablet = screenWidth >= 600 && screenWidth < 900;

    useEffect(() => {
        setFlippedIds([]);
        setFirstCard(null);
        clickLock.current = false;
    }, [game?._id]);

    const responsiveStyles = {
        container: {
            maxWidth: isMobile ? '95%' : isTablet ? '750px' : '800px',
            margin: '2rem auto',
            padding: '0 1rem',
        },
        card: {
            background: '#fff',
            padding: isMobile ? '1.5rem' : '2.5rem',
            borderRadius: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            textAlign: 'center',
            minHeight: isMobile ? '400px' : '520px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            border: '1px solid #f1f5f9',
        },
        statusHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            padding: '0 10px',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '10px' : '0',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
            gap: isMobile ? '8px' : '12px',
            margin: '10px 0',
        },
        gameCard: {
            aspectRatio: '1',
            cursor: 'pointer',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transformStyle: 'preserve-3d',
            position: 'relative',
        },
        face: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            fontSize: isMobile ? '1.2rem' : '1.6rem',
            fontWeight: 'bold',
        },
        front: { background: '#f8fafc', color: '#cbd5e0', border: '2px solid #edf2f7' },
        back: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', transform: 'rotateY(180deg)' },
        matched: { background: '#22c55e', color: '#fff', transform: 'rotateY(180deg)' },
        resultBox: {
            background: '#f8fafc',
            padding: isMobile ? '1rem' : '1.5rem',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            margin: '1rem 0',
        },
        input: {
            padding: isMobile ? '10px' : '12px',
            borderRadius: '10px',
            border: '2px solid #e2e8f0',
            fontSize: isMobile ? '1rem' : '1.2rem',
            width: isMobile ? '100px' : '140px',
            textAlign: 'center',
            margin: '1rem 0',
            outline: 'none',
        },
        primaryBtn: {
            padding: isMobile ? '12px 30px' : '14px 40px',
            background: '#667eea',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%',
        },
        label: { fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' },
    };

    if (!game || game.status === 'won' || game.status === 'lost') {
        const isWin = game?.status === 'won';
        const isLoss = game?.status === 'lost';
        const isFullWin = isWin && game?.matchedPairs === 5;
        const isPartialWin = isWin && game?.matchedPairs < 5;

        return (
            <div style={responsiveStyles.container}>
                <div style={responsiveStyles.card}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', margin: '0 0 10px' }}>
                        {isFullWin && '🏆 FULL WIN!'}
                        {isPartialWin && '✨ PARTIAL WIN!'}
                        {isLoss && '❌ HOUSE WINS'}
                        {!game && 'Memory Match'}
                    </h2>

                    {(isWin || isLoss) && (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '15px' : '30px', marginBottom: '15px', flexWrap: 'wrap' }}>
                                <div>
                                    <span style={responsiveStyles.label}>Final Progress</span>
                                    <span style={{ fontWeight: 'bold', fontSize: isMobile ? '1rem' : '1.2rem' }}>
                                        {game.attempts} / 5
                                    </span>
                                </div>
                                <div>
                                    <span style={responsiveStyles.label}>Total Matches</span>
                                    <span style={{ fontWeight: 'bold', fontSize: isMobile ? '1rem' : '1.2rem', color: '#667eea' }}>
                                        {game.matchedPairs} / 5
                                    </span>
                                </div>
                            </div>

                            <div style={responsiveStyles.resultBox}>
                                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem', flexWrap: 'wrap', gap: '20px' }}>
                                    <div>
                                        <span style={responsiveStyles.label}>To Player</span>
                                        <span style={{ fontSize: isMobile ? '1.2rem' : '1.4rem', fontWeight: '800', color: isWin ? '#22c55e' : '#64748b' }}>
                                            ₹{isWin ? game.winnings : 0}
                                        </span>
                                    </div>

                                    <div style={{ width: '1px', background: '#e2e8f0' }} />

                                    <div>
                                        <span style={responsiveStyles.label}>Admin Profit</span>
                                        <span style={{ fontSize: isMobile ? '1.2rem' : '1.4rem', fontWeight: '800', color: isLoss ? '#ef4444' : '#64748b' }}>
                                            ₹{isLoss ? game.betAmount : 0}
                                        </span>
                                    </div>
                                </div>

                                <span style={{ ...responsiveStyles.label, color: '#667eea' }}>
                                    Wallet Balance: ₹{user.balance?.toLocaleString()}
                                </span>
                            </div>
                        </>
                    )}

                    <div style={{ maxWidth: isMobile ? '100%' : '320px', margin: '1.5rem auto 0' }}>
                        <span style={responsiveStyles.label}>Set Bet Amount</span>
                        <input
                            type="number"
                            value={betAmount}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                            style={responsiveStyles.input}
                            min="10"
                        />
                        <button
                            onClick={() => createGame(betAmount)}
                            disabled={isProcessing || betAmount > user.balance || betAmount < 10}
                            style={{ ...responsiveStyles.primaryBtn, opacity: (isProcessing || betAmount > user.balance) ? 0.6 : 1 }}
                        >
                            {isProcessing ? 'Shuffling...' : 'Start New Game'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const row1 = game.cards.filter(c => c.row === 'top');
    const row2 = game.cards.filter(c => c.row === 'bottom');

    const handleCardClick = async (card, rowName) => {
        if (isProcessing || clickLock.current) return;
        if (card.isOpen || flippedIds.includes(card.id)) return;

        if (!firstCard) {
            if (rowName !== 'top') return;
            setFirstCard(card);
            setFlippedIds([card.id]);
        } else {
            if (rowName !== 'bottom') return;
            if (firstCard.id === card.id) return;

            clickLock.current = true;
            setFlippedIds([firstCard.id, card.id]);

            setTimeout(async () => {
                await handleMatch(firstCard.id, card.id);
                setTimeout(() => {
                    setFlippedIds([]);
                    setFirstCard(null);
                    clickLock.current = false;
                }, 400);
            }, 700);
        }
    };

    return (
        <div style={responsiveStyles.container}>
            <div style={responsiveStyles.card}>
                <div style={responsiveStyles.statusHeader}>
                    <div>
                        <span style={responsiveStyles.label}>Attempts</span>
                        <div style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: '900' }}>
                            {game.attempts} / 5
                        </div>
                    </div>
                    <div>
                        <span style={responsiveStyles.label}>Matches</span>
                        <div style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: '900', color: '#667eea' }}>
                            {game.matchedPairs} / 5
                        </div>
                    </div>
                </div>

                <div style={responsiveStyles.grid}>
                    {row1.map(card => (
                        <CardItem
                            key={card.id}
                            card={card}
                            isFlipped={flippedIds.includes(card.id) || card.isOpen}
                            onClick={() => handleCardClick(card, 'top')}
                            responsiveStyles={responsiveStyles}
                        />
                    ))}
                </div>

                <div style={{ height: '20px' }} />

                <div style={responsiveStyles.grid}>
                    {row2.map(card => (
                        <CardItem
                            key={card.id}
                            card={card}
                            isFlipped={flippedIds.includes(card.id) || card.isOpen}
                            onClick={() => handleCardClick(card, 'bottom')}
                            responsiveStyles={responsiveStyles}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const CardItem = ({ card, isFlipped, onClick, responsiveStyles }) => (
    <div
        onClick={onClick}
        style={{
            ...responsiveStyles.gameCard,
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
    >
        <div style={{ ...responsiveStyles.face, ...responsiveStyles.front }}>?</div>
        <div
            style={{
                ...responsiveStyles.face,
                ...(card.isOpen ? responsiveStyles.matched : responsiveStyles.back),
                visibility: isFlipped ? 'visible' : 'hidden',
            }}
        >
            {card.value}
        </div>
    </div>
);

export default GameBoard;