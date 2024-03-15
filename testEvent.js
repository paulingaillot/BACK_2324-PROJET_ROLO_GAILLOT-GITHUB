const mongoose = require('mongoose');
const Event = require('./model/event');

mongoose.connect("mongodb://localhost:27017/isen", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

const eventData = {
    event_id: 1,
    image : Buffer.from('example_picture_data'),
    theme: 'event',
    prix: 15,
    date: new Date('1990-01-01')
};

async function testAddEvent() {
    try {
        console.log('Adding an event...');
        const newEvent = await Event.addEvent(eventData.event_id, eventData.image, eventData.theme, eventData.prix, eventData.date);
        console.log('Event added:', newEvent);
    } catch (error) {
        console.error('Error adding event:', error);
    }
}

async function testEditEvent() {
    try {
        console.log('Editing a event...');
        const newData = { theme: 'bar' }; // Example new data
        const updatedEvent = await Event.editEvent(eventData.event_id, newData);
        console.log('Event edited:', updatedEvent);
    } catch (error) {
        console.error('Error editing event:', error);
    }
}
async function testGetEvent() {
    try {
        console.log('Getting an event...');
        const Event_ = await Event.getEventById(eventData.event_id);
        console.log('Event :', Event_);
    } catch (error) {
        console.error('Error getting event:', error);
    }
}
async function testDeleteEvent() {
    try {
        console.log('Deleting an event...');
        const deletedEvent = await Event.deleteEvent(eventData.event_id);
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
testAddEvent()
    .then(() => testEditEvent())
    .then(() => testGetEvent())
    .then(() => testDeleteEvent())
    .then(() => closeConnection())
    .catch(error => console.error('Test error:', error));