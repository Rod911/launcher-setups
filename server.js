// CONFIG
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const verifyLogin = require('./middleware/verifyLogin');
const path = require('path');

require('./models/User');
require('./models/Post');
require('./models/Apps');
require('./models/Draft');

dotenv.config({ path: './config/config.env' });

app.use(express.json());
// app.use(express.);

// APP

const auth = require('./routes/auth');
const post = require('./routes/post');
const apps = require('./routes/apps');

app.use('/api/auth', auth);
app.use('/api/post', post);
app.use('/api/apps', apps);

// START

connectDB();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
