require('dotenv').config()
const express = require('express');
const path = require("path");
const http = require('http');
const {Server} = require("socket.io");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const router = require('./routes/index');
const usersRouter = require('./routes/users');
const eventsRouter = require('./routes/events');
const favoriteRouter = require('./routes/favorite')
const mongoose = require("mongoose");

const tchatRouter = require('./routes/tchat');
const { ConversationModel, findByChannel, createChannel, addMessageToChannel} = require('./model/Conversation');
const { createMessage } = require('./model/Message');


app.use(cors())

const { MongoClient } = require('mongodb');

const args = process.argv.slice(2);
const url = args[0] ?? process.env.CONNECTION_MONGO_STR;
const dbName = args[1] ?? "backend2324";

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


app.use('/',router);
app.use('/events',eventsRouter);
app.use('/users',usersRouter);
app.use('/favorites',favoriteRouter);
app.use('/tchat',tchatRouter);

mongoose.connect(url + '/' + dbName, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongoose connection to MongoDB established successfully');
    })
    .catch(err => {
        console.error('Error occurred while establishing Mongoose connection:', err);
    });

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });
const port = 3000;

app.use('/', express.static(path.join(__dirname, "client"), {index: "index.html"}));

let users = {};
io.on('connection', (socket) => {
  // Store user's id and socket
  users[socket.handshake.query.username] = socket;

  socket.on('join room', (room) => {
    socket.join(room);
  });

  socket.on('leave room', (room) => {
    socket.leave(room);
  });

  socket.on('message', async (room, message) => {
      io.to(room).emit('message', { from: socket.handshake.query.username, message });

      // Find the conversation
      let conversation = await findByChannel(room);
      if(conversation === null)  createChannel(room);

      var mess = await createMessage(socket.handshake.query.username, message);
      addMessageToChannel(mess._id, room);
  });

  socket.on('disconnect', () => {
    delete users[socket.handshake.query.username];
  });

});



server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
