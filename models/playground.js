const mongoose = require('mongoose');

// SCHEMA SETUP
let playgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model('Playground', playgroundSchema);