require('dotenv').config()
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const args = process.argv.slice(2);
const url = args[0] ?? process.env.CONNECTION_MONGO_STR;

const userSchema = new mongoose.Schema({
    name: {type: String, required:true},
    surname: {type: String, required:true},
    username: {type: String, required:true, unique: true},
    mail: {type:String, required:true},
    picture: { type: Buffer, required: true },
    password: { type: String, required: true, maxlength: 255 },
    born: { type: Date, required: true },
    is_admin: { type: Boolean, default: false }

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
        return user.toObject();
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
    const user = await User.findOne({ _id: user_id });
    return user.toObject();
}

async function getUserByUsername(username) {
    return await User.findOne({ username: username });
}

async function getUsers() {
    var users=  await User.find({}, 'username picture');
    return users.map(user => {
        const userObj = user.toObject();
        return userObj;
    });
}


module.exports = {
    User: User,
    addUser: addUser,
    editUser: editUser,
    deleteUser: deleteUser,
    getUserByID : getUserByID,
    getUserByUsername : getUserByUsername,
    getUsers: getUsers
};