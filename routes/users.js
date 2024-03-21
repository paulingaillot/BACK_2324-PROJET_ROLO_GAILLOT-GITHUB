const express = require('express');
const router = express.Router();
const { User, addUser, editUser, deleteUser, getUserByID, getUserByUsername, getUsers } = require('../model/user');

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

        const newUser = await addUser(userData);
        if (newUser.error) {
            // Handle custom error returned by addUser function
            return res.status(400).json({ error: newUser.error });
        }

        // If no error occurred, send the new user object
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/all', async (req, res) => {
    try {
    var user = await getUsers();
    res.status(200).json(user);

    }catch (error) {
        console.error('Error during login:', error);
        res.status(400).json({ error: error.message });
    }
})

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


router.get('/userPicture/:username', async (req, res) => {
    try {
    const  username  = req.params.username;
    var user = await getUserByUsername(username);
    var image = user.toObject().picture;
    res.status(200).json({user: image});

    }catch (error) {
        console.error('Error during login:', error);
        res.status(400).json({ error: error.message });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await getUserByUsername(username);
        console.log(user);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        else {
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(403).json({ message: 'Incorrect password' });

            }

            res.status(200).json({ message: 'Login successful', user: user.toObject() });
        }

    } catch (error) {
        console.error('Error during login:', error);
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;
