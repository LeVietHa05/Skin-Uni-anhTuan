const mongoose = require('mongoose');

const environmentSchema = new mongoose.Schema({
  temperature: String,
  humidity: String,
  uv: String,
  uvi: String,
  co: String,
  gas: String,
  dust: String,
});

const Environment = mongoose.model('Disease', environmentSchema);

module.exports = Environment;