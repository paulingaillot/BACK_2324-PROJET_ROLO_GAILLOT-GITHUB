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

app.use(cors())

// const { MongoClient } = require('mongodb');

// const args = process.argv.slice(2);
// const url = args[0] ?? process.env.CONNECTION_MONGO_STR;
// const dbName = args[1] ?? "backend2324";
// const client = new MongoClient(url);

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/',router);
app.use('/events',eventsRouter);
app.use('/users',usersRouter);
app.use('/favorites',favoriteRouter);
mongoose.connect("mongodb://localhost:27017/isen", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

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

  // Send the list of users every 30 seconds
  setInterval(() => {
    io.emit('users', Object.keys(users));
    console.log("Liste des users envoyé")
  }, 30000);

  socket.on('private message', (toId, message) => {
    if (users[toId]) {
      users[toId].emit('private message', message);
    }
  });

  socket.on('disconnect', () => {
    delete users[socket.handshake.query.username];
  });

});



server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
