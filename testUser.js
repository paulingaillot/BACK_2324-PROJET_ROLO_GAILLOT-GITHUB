// require('dotenv').config()
const mongoose = require('mongoose');
const User = require('./model/user');
const Event = require('./model/event');

// const args = process.argv.slice(2);
// const url = args[0] ?? process.env.CONNECTION_MONGO_STR;

mongoose.connect("mongodb://localhost:27017/isen", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

let userData = {
    name: "John",
    username: "john123",
    surname: "Doe",
    mail: "abc@gmail.com",
    picture: Buffer.from('example_picture_data'),
    password: "password123",
    born: new Date("1990-01-01")
};

let userData2 = {
    name: "John2",
    username: "john1234",
    surname: "Doe",
    mail: "abc@gmail.com",
    picture: Buffer.from('example_picture_data'),
    password: "password1234",
    born: new Date("1990-01-01")
};
async function testAddUser() {
    try {
        console.log('Adding a user...');
        const newUser = await User.addUser(userData);
        userData = newUser;
        console.log('User added:', newUser);
    } catch (error) {
        console.error('Error adding user:', error);
    }
}

async function testEditUser() {
    try {
        console.log('Editing a user...');
        const newData = { password: 'new_password' }; // Example new data
        const updatedUser = await User.editUser(userData._id, newData);
        console.log('User edited:', updatedUser);
    } catch (error) {
        console.error('Error editing user:', error);
    }
}

async function testGetUser() {
    try {
        console.log('Getting a user...');
        const getUser = await User.getUserByID(userData._id);
        console.log('User get:', getUser);
    } catch (error) {
        console.error('Error getting user:', error);
    }
}
async function testDeleteUser() {
    try {
        console.log('Deleting a user...');
        const deletedUser = await User.deleteUser(userData._id);
        console.log('User deleted:', deletedUser);
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}
async function closeConnection() {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
}

async function testLogin() {
    try {
        console.log('Simulating login...');
        const user = await User.User.findOne({ _id: userData._id });
        if (!user) {
            console.log('User not found');
            return;
        }
        const isPasswordMatch = await user.comparePassword(userData.password);
        if (isPasswordMatch) {
            console.log('Login successful');
        } else {
            console.log('Invalid password');
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}

async function testAddFavourite() {

    try {
        console.log('Adding an event...');
        let user = await User.addUser(userData2);
        const eventData = {
            creator: user._id,
            name: "blbl",
            image: Buffer.from('example_picture_data'),
            theme: 'event',
            prix: 15,
            date: new Date('1990-01-01')
        };

        const newEvent = await Event.addEvent(eventData);
        console.log('Event added:', newEvent);
        user = await User.addToFavourite(user._id, newEvent._id);
        console.log(user);
        user = await User.deleteOfFavourite(user._id,newEvent._id);
        console.log(user);

        await User.deleteUser(user._id);
        await Event.deleteEvent(newEvent._id);
    } catch (error) {
        console.error('Error adding event:', error);
        throw error;
    }

}
// Run the test functions
testAddUser()
    .then(() => testEditUser())
    .then(() => testGetUser())
    .then(() => testDeleteUser())
    .then(() => testAddFavourite())
    .then(() => closeConnection())
    .catch(error => console.error('Test error:', error));