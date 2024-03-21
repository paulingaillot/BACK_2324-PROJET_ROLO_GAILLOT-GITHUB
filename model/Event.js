require('dotenv').config()
const mongoose = require('mongoose');
const { MongoClient, Double} = require('mongodb');

const args = process.argv.slice(2);
const url = args[0] ?? process.env.CONNECTION_MONGO_STR;

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
    let events =  await Event.findOneAndUpdate({ _id: event_id }, newData, { new: true });
    events = events.toObject();
    return events;
}

async function deleteEvent(event_id) {
    return await Event.findOneAndDelete({ _id: event_id });
}
async function getEventById(event_id) {
    let events = await  Event.findOne({ _id: event_id });
    events = events.toObject();
    return events;
}

async function getAllEvent() {
    const events = await Event.find().sort({ date: 1 });;
    return events.map(event => {
        const eventObj = event.toObject();
        return eventObj;
    });
}
async function filterByName(eventName) {
    const events = await Event.find({ name: { $regex: new RegExp(eventName, 'i') } });
    return events.map(event => {
        const eventObj = event.toObject();
        return eventObj;
    });
}

async function filterByPriceRange(minPrice, maxPrice) {
    const events = await Event.find({ prix: { $gte: minPrice, $lte: maxPrice } });
    return events.map(event => {
        const eventObj = event.toObject();
        return eventObj;
    });

}

async function filterByTheme(theme) {
    const events = await Event.find({ theme: { $regex: new RegExp(theme, 'i') } });
    return events.map(event => {
        const eventObj = event.toObject();
        return eventObj;
    });
}

async function sortByPriceAscending() {
    const events = await Event.find().sort({ prix: 1 });
    return events.map(event => {
        const eventObj = event.toObject();
        return eventObj;
    });
}

async function sortByPriceDescending() {
    const events = await  Event.find().sort({ prix: -1 });
    return events.map(event => {
        const eventObj = event.toObject();
        return eventObj;
    });
}

async function sortByDateAscending() {
    const events = await  Event.find().sort({ date: 1 });
    return events.map(event => {
        const eventObj = event.toObject();
        return eventObj;
    });
}

async function sortByDateDescending() {
    const events = await  Event.find().sort({ date: -1 });
    return events.map(event => {
        const eventObj = event.toObject();
        return eventObj;
    });
}
module.exports = {
    Event: Event,
    addEvent: addEvent,
    editEvent: editEvent,
    deleteEvent: deleteEvent,
    getEventById: getEventById,
    getAllEvent: getAllEvent,
    filterByName: filterByName,
    filterByTheme: filterByTheme,
    filterByPriceRange: filterByPriceRange,
    sortByPriceDescending: sortByPriceDescending,
    sortByPriceAscending:sortByPriceAscending,
    sortByDateDescending: sortByDateDescending,
    sortByDateAscending: sortByDateAscending,

};