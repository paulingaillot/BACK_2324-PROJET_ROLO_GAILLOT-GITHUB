// require('dotenv').config()
const mongoose = require('mongoose');
const User = require('./model/user');

// const args = process.argv.slice(2);
// const url = args[0] ?? process.env.CONNECTION_MONGO_STR;

mongoose.connect("mongodb://localhost:27017/isen", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

const userData = {
    user_id: 1,
    picture: Buffer.from('example_picture_data'),
    password: 'example_password',
    born: new Date('1990-01-01')
};

async function testAddUser() {
    try {
        console.log('Adding a user...');
        const newUser = await User.addUser(userData.user_id, userData.picture, userData.password, userData.born);
        console.log('User added:', newUser);
    } catch (error) {
        console.error('Error adding user:', error);
    }
}

async function testEditUser() {
    try {
        console.log('Editing a user...');
        const newData = { password: 'new_password' }; // Example new data
        const updatedUser = await User.editUser(userData.user_id, newData);
        console.log('User edited:', updatedUser);
    } catch (error) {
        console.error('Error editing user:', error);
    }
}

async function testDeleteUser() {
    try {
        console.log('Deleting a user...');
        const deletedUser = await User.deleteUser(userData.user_id);
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
// Run the test functions
testAddUser()
    .then(() => testEditUser())
    .then(() => testDeleteUser())
    .then(() => closeConnection())
    .catch(error => console.error('Test error:', error));