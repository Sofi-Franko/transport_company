const dotenv = require('dotenv')
const mongoose = require('mongoose')
const Route = require('../models/Route')

dotenv.config()

const runMigration = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    // 1. Set default status to 'awaiting shipment' for routes with no status
    await Route.updateMany({ status: { $nin: ['awaiting shipment', 'in progress', 'completed'] } }, { $set: { status: 'awaiting shipment' } })

    // 2. Update all routes without startCity or endCity using updateMany
    await Route.updateMany(
      { $or: [{ startCity: { $exists: false } }, { endCity: { $exists: false } }] },
      {
        $set: {
          startCity: { $ifNull: ['$startCity', "defaultStartCity"] },
          endCity: { $ifNull: ['$endCity', "defaultEndCity"] },
        },
      },
      { multi: true }
    )

    console.log('Migration completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error running migration:', error)
    process.exit(1)
  }
}

runMigration()
