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
    picture: { type: Buffer, required: true },
    password: { type: String, required: true, maxlength: 255 },
    born: { type: Date, required: true }
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

async function addUser( picture, password, born) {
    const user = new User({
        picture: picture,
        password: password,
        born: born
    });
    return await user.save();
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


module.exports = {
    User: User,
    addUser: addUser,
    editUser: editUser,
    deleteUser: deleteUser,
    getUserByID : getUserByID
};