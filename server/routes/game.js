const express = require("express");
const { auth } = require("../middleware/auth");
const Game = require("../models/Game");
const User = require("../models/User");

const router = express.Router();


router.post("/", auth, async (req, res) => {
    try {
        const { betAmount } = req.body;

        if (!betAmount || betAmount < 10) {
            return res.status(400).json({ error: "Minimum bet ₹10" });
        }

        if (betAmount > req.user.balance) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        req.user.balance -= betAmount;
        await req.user.save();

        const nums = Array.from({ length: 40 }, (_, i) => i + 10)
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);

        const generateRow = (vals, name) =>
            [...vals]
                .sort(() => Math.random() - 0.5)
                .map((v, index) => ({
                    id: `${name}-${Date.now()}-${index}`,
                    row: name,
                    value: v,
                    isOpen: false
                }));

        const game = new Game({
            user: req.user._id,
            betAmount,
            cards: [
                ...generateRow(nums, "top"),
                ...generateRow(nums, "bottom")
            ],
            status: "playing",
            matchedPairs: 0,
            attempts: 0
        });

        await game.save();
        res.json(game);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



router.put("/:id/match", auth, async (req, res) => {
    try {
        const game = await Game.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!game || game.status !== "playing") {
            return res.status(400).json({ error: "Game ended" });
        }

        const { cardId1, cardId2 } = req.body;

        game.attempts = (game.attempts || 0) + 1;

        const c1 = game.cards.find(c => c.id === cardId1);
        const c2 = game.cards.find(c => c.id === cardId2);

        if (c1 && c2 && c1.value === c2.value) {
            c1.isOpen = true;
            c2.isOpen = true;
            game.matchedPairs += 1;
            game.markModified("cards");
        }

        const admin = await User.findOne({ isAdmin: true });


        if (game.matchedPairs === 5) {
            game.status = "won";
            game.winnings = Math.round(game.betAmount * 3);

            if (admin) {
                if (admin.balance < game.winnings) {
                    return res.status(400).json({ error: "Admin has insufficient balance" });
                }

                admin.balance -= game.winnings;
                await admin.save();
            }

            req.user.balance += game.winnings;
            await req.user.save();
        }

        
        
        else if (game.attempts >= 5) {

            let multiplier = 0;

            if (game.matchedPairs >= 3) {
                multiplier = 2;
            } else if (game.matchedPairs === 2) {
                multiplier = 1.5;
            } else if (game.matchedPairs === 1) {
                multiplier = 1.1;
            }

            
            if (multiplier > 0) {
                game.status = "won";
                game.winnings = Math.round(game.betAmount * multiplier);

                if (admin) {
                    if (admin.balance < game.winnings) {
                        return res.status(400).json({ error: "Admin has insufficient balance" });
                    }

                    admin.balance -= game.winnings;
                    await admin.save();
                }

                req.user.balance += game.winnings;
                await req.user.save();
            }

            
            else {
                game.status = "lost";

                if (admin) {
                    admin.balance += game.betAmount;
                    await admin.save();
                }
            }
        }

        game.markModified("attempts");
        game.markModified("status");
        game.markModified("matchedPairs");

        await game.save();
        res.json(game);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



router.get("/current", auth, async (req, res) => {
    const game = await Game.findOne({ user: req.user._id })
        .sort({ createdAt: -1 });

    if (!game || (game.status !== "playing" && game.attempts === 0)) {
        return res.status(404).send();
    }

    res.json(game);
});

module.exports = router;