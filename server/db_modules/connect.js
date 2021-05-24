const mongoose = require('mongoose');
const { DB_NAME, DB_URL } = require('../constants');

mongoose.connect(DB_URL + '/' + DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

let db = mongoose.connection;

db.on('error', () => console.error('db connection error'));
db.once('open', () => console.log('connected to db...'));
