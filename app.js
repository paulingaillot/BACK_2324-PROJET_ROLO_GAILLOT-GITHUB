const express = require('express');
const path = require('path');

const PORT = 3000;
const app = express();
const router = require('./routes/index');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/',router);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
