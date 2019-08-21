const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const containerSchema = new Schema({
  service: {
    type: String,
    required: true,
  },
  filled: {
    type: String,
  },
  waste: {
    type: String,
    required: true,
  },
  capacity: {
    type: String,
    required: true,
  },
  ubicacio: {
    type: String,
    required: true,
  },
  dataEntrega: {
    type: String,
    required: true,
  },
  dataRetirada: {
    type: String,
  }
});

const Container = mongoose.model('Container', containerSchema);

module.exports = Container;