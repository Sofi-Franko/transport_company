const dotenv = require('dotenv')
const mongoose = require('mongoose')
const Transport = require('../models/Transport')

dotenv.config()

const runMigration = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    // 1. Set default status to 'free' for transports with no status
    await Transport.updateMany({ status: { $nin: ['free', 'busy'] } }, { $set: { status: 'free' } })

    // 2. Set purchaseDate to current date for transports with purchaseDate in the future
    const currentDate = new Date()
    await Transport.updateMany({ purchaseDate: { $gt: currentDate } }, { $set: { purchaseDate: currentDate } })

    console.log('Migration completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error running migration:', error)
    process.exit(1)
  }
}

runMigration()
