require('dotenv').config()
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const args = process.argv.slice(2);
const url = args[0] ?? process.env.CONNECTION_MONGO_STR;
mongoose.connect("mongodb://localhost:27017/isen", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

const userSchema = new mongoose.Schema({
    user_id: { type: Number, required: true },
    picture: { type: Buffer, required: true },
    password: { type: String, required: true, maxlength: 255 },
    born: { type: Date, required: true }
});

const User = mongoose.model('User', userSchema);

async function addUser(user_id, picture, password, born) {
    const user = new User({
        user_id: user_id,
        picture: picture,
        password: password,
        born: born
    });
    return await user.save();
}

async function editUser(user_id, newData) {
    return await User.findOneAndUpdate({ user_id: user_id }, newData, { new: true });
}

async function deleteUser(user_id) {
    return await User.findOneAndDelete({ user_id: user_id });
}

module.exports = {
    User: User,
    addUser: addUser,
    editUser: editUser,
    deleteUser: deleteUser
};