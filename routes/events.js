const express = require('express');
const router = express.Router();
const { Event, addEvent, editEvent, deleteEvent, getEventById, getAllEvent, filterByName, filterByPriceRange, filterByTheme, sortByPriceAscending, sortByPriceDescending, sortByDateAscending, sortByDateDescending } = require('../model/Event');

// Middleware pour parser le corps des requêtes en JSON
router.use(express.json());

// Route pour ajouter un événement
router.post('/', async (req, res) => {
    try {
        const eventData = req.body;
        const requiredKeys = ['creator', 'name', 'image', 'theme', 'prix', 'date'];
        for (const key of requiredKeys) {
            if (!(key in eventData)) {
                return res.status(400).json({ error: `Missing required key: ${key}` });
            }
        }

        const newEvent = await addEvent(eventData);
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour modifier un événement
router.put('/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const newData = req.body;
        const updatedEvent = await editEvent(eventId, newData);
        console.log(updatedEvent);
        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour supprimer un événement
router.delete('/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        await deleteEvent(eventId);
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour obtenir un événement par son ID
router.get('/:id', async (req, res) => {
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

// Route pour obtenir tous les événements
router.get('/', async (req, res) => {
    try {
        const events = await getAllEvent();
        if (!events) {
            res.status(404).json({ error: 'Events not found' });
            return;
        }
        res.json(events);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour filtrer les événements par nom
router.get('/filter/name/:eventName', async (req, res) => {
    try {
        const eventName = req.params.eventName;
        const events = await filterByName(eventName);
        res.json(events);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour filtrer les événements par prix
router.get('/filter/price/:minPrice/:maxPrice', async (req, res) => {
    try {
        const minPrice = req.params.minPrice;
        const maxPrice = req.params.maxPrice;
        const events = await filterByPriceRange(minPrice, maxPrice);
        res.json(events);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour filtrer les événements par thème
router.get('/filter/theme/:theme', async (req, res) => {
    try {
        const theme = req.params.theme;
        const events = await filterByTheme(theme);
        res.json(events);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour trier les événements par prix croissant
router.get('/sort/price/ascending', async (req, res) => {
    try {
        const events = await sortByPriceAscending();
        res.json(events);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour trier les événements par prix décroissant
router.get('/sort/price/descending', async (req, res) => {
    try {
        const events = await sortByPriceDescending();
        res.json(events);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour trier les événements par date croissante
router.get('/sort/date/ascending', async (req, res) => {
    try {
        const events = await sortByDateAscending();
        res.json(events);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour trier les événements par date décroissante
router.get('/sort/date/descending', async (req, res) => {
    try {
        const events = await sortByDateDescending();
        res.json(events);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
