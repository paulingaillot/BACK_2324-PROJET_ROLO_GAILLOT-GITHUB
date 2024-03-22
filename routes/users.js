const express = require('express');
const router = express.Router();
const { User, addUser, editUser, deleteUser, getUserByID, getUserByUsername, getUsers } = require('../model/User');
var jwt= require('jsonwebtoken');

// Middleware pour parser le corps des requêtes en JSON
router.use(express.json());

// Route pour ajouter un utilisateur
router.post('/addUser', async (req, res) => {
    try {

        // Récupérer les données JSON de la requête
        const userData = req.body;
        console.log(userData)
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
        var accessToken = jwt.sign({username: req.body.username}, 'supersecret', {expiresIn: 120});
        var refreshToken = jwt.sign({username: req.body.username}, 'supersecret', {expiresIn: '7d'});

        res.status(201).json({user : newUser, accessToken: accessToken, refreshToken: refreshToken});
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/isAuth', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.sendStatus(401);
        }
    
        const token = authHeader.split(' ')[1];  // Authorization: Bearer <token>
    
        jwt.verify(token, 'supersecret', async (err, user1) => {
            if (err) {
                // The token is not valid
                return res.sendStatus(403);
            }
            res.status(200).json({ message: 'User is authenticated' });
        });
        }catch (error) {
            console.error('Error during login:', error);
            res.status(400).json({ error: error.message });
        }
});

router.get('/all', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.sendStatus(401);
        }
    
        const token = authHeader.split(' ')[1];  // Authorization: Bearer <token>
    
        jwt.verify(token, 'supersecret', async (err, user1) => {
    var user = await getUsers();
    res.status(200).json(user);
        });

    }catch (error) {
        console.error('Error during login:', error);
        res.status(400).json({ error: error.message });
    }
})

router.get('/get', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.sendStatus(401);
        }

        const token = authHeader.split(' ')[1];  // Authorization: Bearer <token>

        jwt.verify(token, 'supersecret', async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            // user is the decoded payload of the token
            console.log(user)
            const username = user.username;

            try {
                const user = await getUserByUsername(username);
                res.json(user.toObject());
            } catch (error) {
                console.error('Error during getting user:', error);
                res.status(400).json({ error: error.message });
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(400).json({ error: error.message });
    }
});

// Route pour modifier un utilisateur
router.put('/:id', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.sendStatus(401);
        }
    
        const token = authHeader.split(' ')[1];  // Authorization: Bearer <token>
    
        jwt.verify(token, 'supersecret', async (err, user1) => {
        const userId = req.params.id;
        const newData = req.body;
        const updatedUser = await editUser(userId, newData);
        res.json(updatedUser.toObject());
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Route pour obtenir un utilisateur par son ID
router.get('/:id', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.sendStatus(401);
        }
    
        const token = authHeader.split(' ')[1];  // Authorization: Bearer <token>
    
        jwt.verify(token, 'supersecret', async (err, user1) => {
        const userId = req.params.id;
        const user = await getUserByID(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.get('/userPicture/:username', async (req, res) => {
    try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];  // Authorization: Bearer <token>

    jwt.verify(token, 'supersecret', async (err, user1) => {
        if (err) {
            // The token is not valid
            return res.sendStatus(403);
        }
    try {
    const  username  = req.params.username;
    var user = await getUserByUsername(username);
    var image = user.toObject().picture;
    res.status(200).json({user: image});

    }catch (error) {
        console.error('Error during login:', error);
        res.status(400).json({ error: error.message });
    }
});
}catch(error) {
    console.error('Error during login:', error);
}
});

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
            var accessToken = jwt.sign({username: req.body.username}, 'supersecret', {expiresIn: 120});
            var refreshToken = jwt.sign({username: req.body.username}, 'supersecret', {expiresIn: '7d'});
            res.status(200).json({ message: 'Login successful', accessToken: accessToken, refreshToken: refreshToken, user: user.toObject() });
        }

    } catch (error) {
        console.error('Error during login:', error);
        res.status(400).json({ error: error.message });
    }
});

router.post('/token', (req, res) => {
    try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];  // Authorization: Bearer <token>

    jwt.verify(token, 'supersecret', async (err, user1) => {
        if (err) {
            return res.sendStatus(403);
        }
        const accessToken = jwt.sign({ username: user1.username }, 'supersecret', { expiresIn: '120s' });
        res.json({ accessToken: accessToken });
    });
}catch(error) {
    console.error('Error during login:', error);
    res.status(400).json({ error: error.message });
}
});


module.exports = router;
