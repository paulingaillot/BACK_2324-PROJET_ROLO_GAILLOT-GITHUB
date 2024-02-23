require('dotenv').config()
const mongoose = require('mongoose');
const { MongoClient, Double} = require('mongodb');

const args = process.argv.slice(2);
const url = args[0] ?? process.env.CONNECTION_MONGO_STR;
mongoose.connect("mongodb://localhost:27017/isen", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

const eventSchema = new mongoose.Schema({
    event_id: { type: Number, required: true },
    image: { type: Buffer, required: true },
    theme: { type: String, required: true, maxlength: 255 },
    prix: { type: Number, required: true },
    date: { type: Date, required: true }
});

const Event = mongoose.model('Event', eventSchema);

async function addEvent(event_id, image, theme, prix, date) {
    const event = new Event({
        event_id: event_id,
        image: image,
        theme: theme,
        prix: prix,
        date: date,
    });
    return await event.save();
}

async function editEvent(event_id, newData) {
    return await Event.findOneAndUpdate({ event_id: event_id }, newData, { new: true });
}

async function deleteEvent(event_id) {
    return await Event.findOneAndDelete({ event_id: event_id });
}

module.exports = {
    Event: Event,
    addEvent: addEvent,
    editEvent: editEvent,
    deleteEvent: deleteEvent
};