const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CAR_SCHEMA = new Schema({
    "manufacturer": String,
    "name": String,
    "type": String,
    "color": String
});

let CAR_MODEL = mongoose.model('cars', CAR_SCHEMA);
module.exports = CAR_MODEL;