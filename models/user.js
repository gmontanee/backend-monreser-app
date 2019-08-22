const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  direction: {
    type: String
  },
  country: {
    type: String
  },
  region: {
    type: String
  },
  town: {
    type: String
  },
  postalCode: {
    type: String
  },
  archivedContainers: [{
    type: ObjectId,
    default: 'Container'
  }],
  activeContainers: [{
    type: ObjectId,
    ref: 'Container'
  }],
  listOfTransporters: [{
    type: ObjectId,
    ref: 'User'
  }],
  listOfClients: [{
    type: ObjectId,
    ref: 'User'
  }],
  isAdmin: {
    type: Boolean,
    default: false
  },
  isTransporter: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
