const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const routeSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  startCity: {
    type: String,
    required: true,
  },
  endCity: {
    type: String,
    required: true,
  },
  distance: Number,
  dispatchDate: Date,
  executionDate: Date,
  transportType: String,
  revenue: Number,
  transportId: String,
  status: {
    type: String,
    enum: ['awaiting shipment', 'in progress', 'completed'],
  },
})

module.exports = mongoose.model('Route', routeSchema)
