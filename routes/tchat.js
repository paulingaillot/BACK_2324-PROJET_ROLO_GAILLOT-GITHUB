const express = require('express');
const router = express.Router();
const {findByChannel} = require('../model/Conversation');
var jwt= require('jsonwebtoken');


// Middleware pour parser le corps des requêtes en JSON
router.use(express.json());

router.get('/restore/:room', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.sendStatus(401);
        }
    
        const token = authHeader.split(' ')[1];  // Authorization: Bearer <token>
    
        jwt.verify(token, 'supersecret', async (err, user) => {
        const room = req.params.room;
        res.json(await findByChannel(room));
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;
