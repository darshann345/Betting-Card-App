import { useState, useEffect, useCallback, useRef } from "react";
import { gameAPI, authAPI } from "../services/api";

const useGameLogic = (updateUser) => {
    const [game, setGame] = useState(null);
    const [betAmount, setBetAmount] = useState(10);
    const [isProcessing, setIsProcessing] = useState(false);

    const hasInitialFetched = useRef(false);

    const actionLock = useRef(false);

  
    const fetchCurrentGame = useCallback(async () => {
        try {
            const res = await gameAPI.current();

            if (res.data) {
                setGame(res.data);
            }
        } catch (e) {
            setGame(prev => {
                if (prev?.status === "won" || prev?.status === "lost") {
                    return prev;
                }
                return null;
            });
        }
    }, []);

   
    const createGame = async (amount) => {
        if (isProcessing || actionLock.current) return;

        setIsProcessing(true);
        actionLock.current = true;

        try {
            const res = await gameAPI.create(amount);
            setGame(res.data);

            const userRes = await authAPI.me();
            updateUser(userRes.data);

        } catch (e) {
            alert(e.response?.data?.error || "Failed to start game");
        } finally {
            setIsProcessing(false);
            actionLock.current = false;
        }
    };

    
    const handleMatch = async (id1, id2) => {
        if (!game || isProcessing || actionLock.current) return;

        if (id1 === id2) return;

        const c1 = game.cards.find(c => c.id === id1);
        const c2 = game.cards.find(c => c.id === id2);

        if (!c1 || !c2 || c1.isOpen || c2.isOpen) return;

        setIsProcessing(true);
        actionLock.current = true;

        setGame(prev => ({
            ...prev,
            cards: prev.cards.map(c =>
                c.id === id1 || c.id === id2
                    ? { ...c, isOpen: true }
                    : c
            )
        }));

        try {
            const res = await gameAPI.match(game._id, id1, id2);

            setGame(res.data);

            if (res.data.status !== "playing") {
                const userRes = await authAPI.me();
                updateUser(userRes.data);
            }

        } catch (e) {
            console.error("Match error:", e);

            setGame(prev => ({
                ...prev,
                cards: prev.cards.map(c =>
                    c.id === id1 || c.id === id2
                        ? { ...c, isOpen: false }
                        : c
                )
            }));
        } finally {
            setIsProcessing(false);
            actionLock.current = false;
        }
    };

  
    const resetGame = () => {
        setGame(null);
    };

    
    useEffect(() => {
        if (!hasInitialFetched.current) {
            fetchCurrentGame();
            hasInitialFetched.current = true;
        }
    }, [fetchCurrentGame]);

    return {
        game,
        createGame,
        handleMatch,
        resetGame,
        betAmount,
        setBetAmount,
        isProcessing
    };
};

export default useGameLogic;