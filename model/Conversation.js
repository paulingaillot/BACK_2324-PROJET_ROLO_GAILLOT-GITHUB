const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

const ConversationModel = mongoose.model('Conversation', conversationSchema);

class Conversation {
    static async save(participants) {
        const conversation = new ConversationModel({
            participants: participants
        });
        return await conversation.save();
    }

    static async findById(id) {
        return await ConversationModel.findById(id).populate('messages');
    }

    static async findByParticipants(participants) {
        return await ConversationModel.findOne({ participants: { $all: participants } }).populate('messages');
    }
}

module.exports = Conversation;
