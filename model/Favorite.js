const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);


async function getAll() {
    try {
        return await Favorite.find();
    } catch (error) {
        throw new Error('Erreur lors de la récupération de tous les favoris.');
    }
}

async function getByEvent(eventId) {
    try {
        return await Favorite.find({ event: eventId });
    } catch (error) {
        throw new Error('Erreur lors de la récupération des favoris par événement.');
    }
}

async function getByUser(userId) {
    try {
        return await Favorite.find({ users: { $in: [userId] } });
    } catch (error) {
        throw new Error('Erreur lors de la récupération des favoris par utilisateur.');
    }
}


async function add(userId, eventId) {
    try {

        // Check if a favorite with the given event ID exists
        const existingFavorite = await Favorite.findOne({ event: eventId });

        if (existingFavorite) {
            if (!existingFavorite.users.includes(userId)) {
                existingFavorite.users.push(userId);
                await existingFavorite.save();
                return existingFavorite;
            } else {
                return existingFavorite;
            }
        } else {
            const newFavorite = new Favorite({ users: [userId], event: eventId });
            return await newFavorite.save();
        }
    } catch (error) {
        throw new Error('Erreur lors de l\'ajout du favori.');
    }
}

 async function deleteFav(userId, eventId) {
     try {
         const favorite = await Favorite.findOne({ event: eventId });

         if (favorite) {
             favorite.users = favorite.users.filter(id => id.toString() !== userId.toString());

             await favorite.save();

             return favorite;
         } else {
             return null;
         }
     } catch (error) {
         throw new Error('Erreur lors de la suppression du favori.');
     }
}


module.exports = {
    Favorite: Favorite,
    add: add,
    deleteFav: deleteFav,
    getByUser :getByUser,
    getByEvent : getByEvent,
    getAll: getAll
};
