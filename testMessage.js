const mongoose = require('mongoose');
const Message = require('./model/message');
const User = require('./model/user');
const Conversation = require('./model/conversation');

mongoose.connect('mongodb://localhost:27017/isen', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

async function runTests() {
    try {
        // Création des utilisateurs
        const senderData = {
            name: "Johnqssxcsevzegc",
            username: "john1234",
            surname: "Doe",
            picture: Buffer.from('example_picture_data'),
            password: "password123",
            born: new Date("1990-01-01")
        };
        const receiverData = {
            name: "Johnqsc",
            username: "john123",
            surname: "Doe",
            picture: Buffer.from('example_picture_data'),
            password: "password123",
            born: new Date("1990-01-01")
        };

        const sender = await User.addUser(senderData);
        const receiver = await User.addUser(receiverData);

        // Création de la conversation
        const participants = [sender._id, receiver._id];
        const conv = await Conversation.save(participants);

        // Test saving a new message
        const savedMessage = await Message.save(sender._id, receiver._id, 'Hello, world!', conv._id);
        console.log('Saved message:', savedMessage);

        // Test finding messages by conversation
        const messagesInConversation = await Message.findByConversation(conv._id);
        console.log('Messages in conversation:', messagesInConversation);

        // Test finding messages by conversation and user
        const messagesInConversationAndUser = await Message.findByConversationAndUser(conv._id, receiver._id);
        console.log('Messages in conversation involving user:', messagesInConversationAndUser);
    } catch (error) {
        console.error('Error running tests:', error);
    } finally {
        // Disconnect from MongoDB after tests are done
        mongoose.disconnect();
    }
}

// Run the tests
runTests();
