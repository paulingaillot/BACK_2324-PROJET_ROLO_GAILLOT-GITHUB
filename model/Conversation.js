const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    channel: {type: String, required:true},
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

const ConversationModel = mongoose.model('Conversation', conversationSchema);

class Conversation {
    static async createChannel(channel) {
        const conversation = new ConversationModel({
            channel: channel
        });
        return await conversation.save();
    }

    static async findById(id) {
        return await ConversationModel.findById(id).populate('messages');
    }

    static async findByChannel(channel) {
        return await ConversationModel.findOne({ channel : channel }).populate('messages');
    }

    static async addMessageToChannel(mess_id, room) {
        let conversation = await ConversationModel.findOne({ channel : room });

        if (!conversation) {
            throw new Error('Conversation not found');
        }
    
        conversation.messages.push(mess_id);
        await conversation.save();
    
        return conversation;
    }
}


module.exports = Conversation;
