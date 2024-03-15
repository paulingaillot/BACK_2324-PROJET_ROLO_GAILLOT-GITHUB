const express = require('express');
const router = express.Router();
const { User, addUser, editUser, deleteUser, getUserByID } = require('../model/user');

// Middleware pour parser le corps des requêtes en JSON
router.use(express.json());

// Route pour ajouter un utilisateur
router.post('/addUser', async (req, res) => {
    try {
        // Récupérer les données JSON de la requête
        const userData = req.body;

        // Vérifier si toutes les clés requises sont présentes dans les données JSON
        const requiredKeys = ['name', 'username', 'surname', 'mail', 'picture', 'password', 'born'];
        for (const key of requiredKeys) {
            if (!(key in userData)) {
                return res.status(400).json({ error: `Missing required key: ${key}` });
            }
        }

        // Ajouter l'utilisateur en utilisant les données JSON fournies
        const newUser = await addUser(userData);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal server error' });
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

router.post('/login', async (req, res) => {
    try {
        const { username, pwd } = req.body;
        const user = await getUserByUsername(username);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        else {
            const isMatch = await user.comparePassword(pwd);
            if (!isMatch) {
                return res.status(403).json({ message: 'Incorrect password' });
            }

            res.status(200).json({ message: 'Login successful', user: user });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;
