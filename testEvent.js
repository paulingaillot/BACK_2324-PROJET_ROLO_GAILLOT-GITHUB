const mongoose = require('mongoose');
const Event = require('./model/event');
const User = require('./model/user');

mongoose.connect("mongodb://localhost:27017/isen", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

async function testAddUser() {
    try {
        console.log('Adding a user...');
        const userData = {
            name: "Johnxx",
            username: "john123d",
            surname: "Doe",
            mail: "abc@gmail.com",
            picture: Buffer.from('example_picture_data'),
            password: "password123",
            born: new Date("1990-01-01")
        };
        const user2 = await User.addUser(userData);
        console.log('User added:', user2);
        return user2;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}
let eventDatas;
async function testAddEvent(user) { // Pass the user object as a parameter
    console.log(user)
    try {
        console.log('Adding an event...');
        const eventData = {
            creator: user._id,
            name: "blbl",
            image: Buffer.from('example_picture_data'),
            theme: 'event',
            prix: 15,
            date: new Date('1990-01-01')
        };

        const newEvent = await Event.addEvent(eventData);
        eventDatas = newEvent;
        console.log('Event added:', newEvent);
        return newEvent; // Return the new event object
    } catch (error) {
        console.error('Error adding event:', error);
        throw error;
    }
}

async function testEditEvent() {
    try {
        console.log('Editing a event...');
        const newData = { theme: 'bar' }; // Example new data
        console.log(eventDatas);
        const updatedEvent = await Event.editEvent(eventDatas._id, newData);
        console.log('Event edited:', updatedEvent);
    } catch (error) {
        console.error('Error editing event:', error);
    }
}
async function testGetEvent() {
    try {
        console.log('Getting an event...');
        const Event_ = await Event.getEventById(eventDatas._id);
        console.log('Event :', Event_);
    } catch (error) {
        console.error('Error getting event:', error);
    }
}
async function testDeleteEvent() {
    try {
        console.log('Deleting an event...');
        const deletedEvent = await Event.deleteEvent(eventDatas._id);
        console.log('Event deleted:', deletedEvent);
    } catch (error) {
        console.error('Error deleting event:', error);
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


async function runTests() {
    try {
        const user = await testAddUser(); // Get the user object
        const event = await testAddEvent(user); // Pass the user object to testAddEvent
        await testEditEvent(event); // Call testEditEvent with the event object
        await testGetEvent(event); // Call testGetEvent with the event object
        await testDeleteEvent(event); // Call testDeleteEvent with the event object

        // Call other test functions passing necessary parameters...
    } catch (error) {
        console.error('Test error:', error);
    } finally {
        await closeConnection();
    }
}

runTests();