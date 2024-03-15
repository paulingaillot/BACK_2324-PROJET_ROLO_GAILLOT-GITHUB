const express = require('express');
const router = express.Router();
const { Event, addEvent, editEvent, deleteEvent, getEventById } = require('./eventFunctions');
const {getAllEvent} = require("../model/Event");

// Middleware pour parser le corps des requêtes en JSON
router.use(express.json());

// Route pour ajouter un événement
router.post('/events', async (req, res) => {
    try {
        const { event_id, image, theme, prix, date } = req.body;
        const newEvent = await addEvent(event_id, image, theme, prix, date);
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour modifier un événement
router.put('/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const newData = req.body;
        const updatedEvent = await editEvent(eventId, newData);
        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour supprimer un événement
router.delete('/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        await deleteEvent(eventId);
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour obtenir un événement par son ID
router.get('/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await getEventById(eventId);
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        res.json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/events', async (req, res) => {
    try {

        const event = await getAllEvent();
        if (!event) {
            res.status(404).json({ error: 'Events not found' });
            return;
        }
        res.json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
module.exports = router;
