const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true }
});

const MessageModel = mongoose.model('Message', messageSchema);

class Message {
    static async createMessage(sender, content) {
        const message = new MessageModel({
            sender: sender,
            content: content
        });
        return await message.save();
    }

    static async getMessagesFromIds(messageIds) {
        return await MessageModel.find({
            '_id': { $in: messageIds }
        });
    }
}

module.exports = Message;
