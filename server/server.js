const express = require('express');
const app = express();
const path = require('path');
const router = require('./routes');
const connectToDb = require('./db_modules/connect');

const users = [
    { name: 'Arvind' },
    { name: 'Ankitha' }
]

app.get('/users', (req, res) => {
    res.json(users)
})

app.use('/api', router);
app.use(express.static(path.join(__dirname, 'cars-client')));
app.listen(5000, () => console.log('Server started on port 5000'));