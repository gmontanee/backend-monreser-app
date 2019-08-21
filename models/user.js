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
  archivedContainers: {
    type: [ObjectId],
    default: []
  },
  activeContainers: {
    type: [ObjectId],
    ref: 'Container'
  },
  listOfTransporters: {
    type: [ObjectId],
    default: []
  },
  listOfClients: {
    type: [ObjectId],
    default: []
  },
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
