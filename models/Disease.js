const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  symptoms: [String],
  treatments: [String],
  cite: String,
});

const Disease = mongoose.model('Disease', diseaseSchema);

module.exports = Disease;