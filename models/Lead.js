const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const leadSchema = new mongoose.Schema({
  jmeno: {
    type: String,
    required: true
  },
  prijmeni: {
    type: String,
    required: true
  },
  telefon: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  status: {
    type: String,
    enum: ['new', 'agreed', 'disagreed'],
    default: 'new'
  },
  notes: [noteSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lead', leadSchema);