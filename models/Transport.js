const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const transportSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['free', 'busy'],
  },
  model: String,
  purchaseDate: {
    type: Date,
    validate: {
      validator: function(value) {
        // if purchaseDate is not in the future
        return value <= new Date()
      },
      message: 'purchaseDate cannot be in the future',
    },
  },
  mileage: Number,
  type: String,
})

module.exports = mongoose.model('Transport', transportSchema)
