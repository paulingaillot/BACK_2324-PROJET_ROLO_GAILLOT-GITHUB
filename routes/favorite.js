const express = require('express');
const router = express.Router();
const {Favorite, add, deleteFav, getByEvent, getByUser} = require('../model/favorite'); // Assuming your Favorite class is in a file called Favorite.js

// GET all favorites
router.get('/', async (req, res) => {
    try {
        const favorites = await getAll();
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET favorites by event ID
router.get('/event/:eventId', async (req, res) => {
    try {

        const favorites = await getByEvent(req.params.eventId);
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET favorites by user ID
router.get('/user/:userId', async (req, res) => {
    try {
        const favorites = await getByUser(req.params.userId);
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a favorite
router.post('/', async (req, res) => {
    try {
        const { userId, eventId } = req.body;
        const favorite = await add(userId, eventId);
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a favorite
router.delete('/', async (req, res) => {
    try {
        console.log(req.body);
        const { userId, eventId } = req.body;
        await deleteFav(userId, eventId);
        res.json({ message: 'Favorite deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
