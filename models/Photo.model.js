const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 25, match: /^[a-zA-Z0-9\s_,!-]+$/ },
  author: { type: String, required: true, maxlength: 50, match: /^[a-zA-Z0-9\s_-]+$/ },
  email: { type: String, required: true, match: /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9_-]+\.[a-zA-Z]{2,3}$/ },
  src: { type: String, required: true },
  votes: { type: Number, required: true },
});

module.exports = mongoose.model('Photo', photoSchema);
