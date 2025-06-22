const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  jmeno: String,
  prijmeni: String,
  telefon: String,
  email: String,
  status: {
    type: String,
    default: 'nedomluvené',
    enum: ['domluvené', 'nedomluvené']
  },
  posledniVolani: Date,
  poznamky: [{
    text: String,
    datum: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lead', LeadSchema);