// require('dotenv').config()
const express = require('express');
const path = require('path');

const PORT = 3000;
const app = express();
const router = require('./routes/index');
const usersRouter = require('./routes/users');
const eventsRouter = require('./routes/events');


// const { MongoClient } = require('mongodb');

// const args = process.argv.slice(2);
// const url = args[0] ?? process.env.CONNECTION_MONGO_STR;
// const dbName = args[1] ?? "backend2324";
// const client = new MongoClient(url);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/',router);
app.use('/events',eventsRouter);
app.use('/users',usersRouter);

// mongoose.connect(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(error => console.error('Error connecting to MongoDB:', error));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//abcdef