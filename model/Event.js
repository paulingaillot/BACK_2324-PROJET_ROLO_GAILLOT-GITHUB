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
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: {type: String, required:true},
    image: { type: Buffer, required: true },
    theme: { type: String, required: true, maxlength: 255 },
    prix: { type: Number, required: true },
    date: { type: Date, required: true }
});

const Event = mongoose.model('Event', eventSchema);

async function addEvent(eventData) {
    const { creator, name, image, theme, prix, date } = eventData;
    const event = new Event({
        creator: creator,
        name: name,
        image: Buffer.from(image),
        theme: theme,
        prix: prix,
        date: date,
    });
    return await event.save();
}

async function editEvent(event_id, newData) {
    return await Event.findOneAndUpdate({ _id: event_id }, newData, { new: true });
}

async function deleteEvent(event_id) {
    return await Event.findOneAndDelete({ _id: event_id });
}
async function getEventById(event_id) {
    return await Event.findOne({ _id: event_id });
}

async function getAllEvent(){
    return await Event.find();
}

module.exports = {
    Event: Event,
    addEvent: addEvent,
    editEvent: editEvent,
    deleteEvent: deleteEvent,
    getEventById: getEventById,
    getAllEvent: getAllEvent
};