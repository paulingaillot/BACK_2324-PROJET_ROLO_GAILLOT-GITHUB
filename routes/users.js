const express = require('express');
const router = express.Router();
const { User, addUser, editUser, deleteUser, getUserByID } = require('../model/user');

// Middleware pour parser le corps des requêtes en JSON
router.use(express.json());

// Route pour ajouter un utilisateur
router.post('/', async (req, res) => {
    try {
        const { user_id, picture, password, born } = req.body;
        const newUser = await addUser(user_id, picture, password, born);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour modifier un utilisateur
router.put('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const newData = req.body;
        const updatedUser = await editUser(userId, newData);
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour supprimer un utilisateur
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await deleteUser(userId);
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route pour obtenir un utilisateur par son ID
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await getUserByID(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
