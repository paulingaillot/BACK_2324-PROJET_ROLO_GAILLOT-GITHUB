require('dotenv').config()
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const args = process.argv.slice(2);
const url = args[0] ?? process.env.CONNECTION_MONGO_STR;
mongoose.connect("mongodb://localhost:27017/isen", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

const userSchema = new mongoose.Schema({
    name: {type: String, required:true},
    surname: {type: String, required:true},
    username: {type: String, required:true, unique: true},
    mail: {type:String, required:true},
    picture: { type: Buffer, required: true },
    password: { type: String, required: true, maxlength: 255 },
    born: { type: Date, required: true },
    is_admin: { type: Boolean, default: false },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};
const User = mongoose.model('User', userSchema);

async function addUser(userData) {
    try {
        const { name, username, surname, mail, picture, password, born } = userData;
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return { error: 'Username is already taken' };
        }

        const user = new User({
            username: username,
            name: name,
            surname: surname,
            mail: mail,
            picture: Buffer.from(picture),
            password: password,
            born: born,
        });
        await user.save();
        return user;
    } catch (error) {
        return { error: 'Failed to add user' }; // Return a generic error message
    }
}



async function editUser(user_id, newData) {
    if (newData.password) {
        newData.password = await bcrypt.hash(newData.password, 10);
    }
    return await User.findOneAndUpdate({ _id: user_id }, newData, { new: true });
}

async function deleteUser(user_id) {
    return await User.findOneAndDelete({ _id: user_id });
}

async function getUserByID(user_id) {
    return await User.findOne({ _id: user_id });
}
async function getUserByUsername(username) {
    return await User.findOne({ username: username });
}


async function addToFavourite(user_id,event_id){
    user = await User.findOne(_id = user_id);
    if (user.favorites.includes(event_id)) {
        return { status: 400, message: 'Event is already in favorites' };
    }

    user.favorites.push(event_id);
    await user.save();
    return user;
}

async function deleteOfFavourite(user_id,event_id){
    user = await User.findOne(_id = user_id);
    const index = user.favorites.indexOf(event_id);

    if (index !== -1) {
        user.favorites.splice(index, 1);
        await user.save();
    }
    return user;
}

module.exports = {
    User: User,
    addUser: addUser,
    editUser: editUser,
    deleteUser: deleteUser,
    getUserByID : getUserByID,
    getUserByUsername : getUserByUsername,
    addToFavourite: addToFavourite,
    deleteOfFavourite: deleteOfFavourite,
};