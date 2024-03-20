const express = require('express');
const router = express.Router();
const {findByChannel} = require('../model/Conversation');

// Middleware pour parser le corps des requêtes en JSON
router.use(express.json());

router.get('/restore/:room', async (req, res) => {
    try {
        const room = req.params.room;
        res.json(await findByChannel(room));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;
