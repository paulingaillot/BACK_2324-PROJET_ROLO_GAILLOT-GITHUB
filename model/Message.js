const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true }
});

const MessageModel = mongoose.model('Message', messageSchema);

class Message {
    static async save(sender, receiver, content, conversation) {
        const message = new MessageModel({
            sender: sender,
            receiver: receiver,
            content: content,
            conversation: conversation
        });
        return await message.save();
    }

    static async findByConversation(conversationId) {
        return await MessageModel.find({ conversation: conversationId });
    }
    static async findByConversationAndUser(conversationId, userId) {
        let messages = await MessageModel.find({ conversation: conversationId });
        messages = messages.filter(message =>
            message.sender.toString() === userId || message.receiver.toString() === userId
        );
        return messages;
    }
}

module.exports = Message;
