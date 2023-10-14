const mongoose = require('mongoose');

const environmentSchema = new mongoose.Schema({
  temperature: String,
  humidity: String,
  uv: String,
  uvi: String,
  co: String,
  gas: String,
  dust: String,
  time: {
    type: Date,
    default: Date.now
  }
});

const Environment = mongoose.model('environment', environmentSchema);

module.exports = Environment;