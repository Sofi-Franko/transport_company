const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Route = require('./models/Route')
const Transport = require('./models/Transport')

const environment = process.env.NODE_ENV || "development"
dotenv.config({ path: `.env${environment === 'development' ? '' : '.' + environment}` });

const transports = [
  {
    licensePlate: 'ABC123',
    status: 'free',
    model: 'Truck A',
    purchaseDate: new Date(),
    mileage: 10000,
    type: 'truck',
  },
  {
    licensePlate: 'CDE456',
    status: 'free',
    model: 'Car B',
    purchaseDate: new Date(),
    mileage: 5000,
    type: 'car',
  },
  {
    licensePlate: 'EFG789',
    status: 'busy',
    model: 'Truck C',
    purchaseDate: new Date(),
    mileage: 20000,
    type: 'truck',
  },
  {
    licensePlate: 'IJK000',
    status: 'busy',
    model: 'Car D',
    purchaseDate: new Date(),
    mileage: 8000,
    type: 'car',
  },
  {
    licensePlate: 'JUI765',
    status: 'free',
    model: 'Car E',
    purchaseDate: new Date(),
    mileage: 83000,
    type: 'car',
  },{
    licensePlate: 'LOI820',
    status: 'free',
    model: 'Truck F',
    purchaseDate: new Date(),
    mileage: 2000,
    type: 'truck',
  },{
    licensePlate: 'HHH000',
    status: 'free',
    model: 'Van J',
    purchaseDate: new Date(),
    mileage: 2000,
    type: 'van',
  },
]
const routes = [
  {
    startCity: 'Brno',
    endCity: 'Ostrava',
    distance: 100,
    dispatchDate: new Date(),
    executionDate: new Date(),
    transportType: 'truck',
    revenue: 500,
    status: 'in progress',
  },
  {
    startCity: 'Kyiv',
    endCity: 'Prague',
    distance: 200,
    dispatchDate: new Date(),
    executionDate: new Date(),
    transportType: 'car',
    revenue: 300,
    status: 'awaiting shipment',
  },
  {
    startCity: 'Ternopil',
    endCity: 'Kharkiv',
    distance: 150,
    dispatchDate: new Date(),
    executionDate: new Date(),
    transportType: 'truck',
    revenue: 400,
    status: 'completed',
  },
  {
    startCity: 'Lviv',
    endCity: 'Ternopil',
    distance: 300,
    dispatchDate: new Date(),
    executionDate: new Date(),
    transportType: 'car',
    revenue: 600,
    status: 'completed',
  },
  {
    startCity: 'Kyiv',
    endCity: 'Lublin',
    distance: 250,
    dispatchDate: new Date(),
    executionDate: new Date(),
    transportType: 'truck',
    revenue: 800,
    status: 'awaiting shipment',
  },
  {
    startCity: 'Warsawa',
    endCity: 'Plzen',
    distance: 400,
    dispatchDate: new Date(),
    executionDate: new Date(),
    transportType: 'car',
    revenue: 700,
    status: 'completed',
  },
]

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    // Delete existing data
    await Route.deleteMany({})
    await Transport.deleteMany({})

    // Create transports
    const createdTransports = await Transport.insertMany(transports)

    // Assign transports to corresponding routes
    routes[0].transportId = createdTransports[0].id
    routes[1].transportId = createdTransports[1].id
    routes[2].transportId = createdTransports[2].id
    routes[3].transportId = createdTransports[3].id

    // Update transport status
    createdTransports[0].status = 'busy'
    createdTransports[1].status = 'busy'
    await createdTransports[0].save()
    await createdTransports[1].save()

    // Create routes
    await Route.insertMany(routes)

    console.log('Data seeding completed')
    mongoose.connection.close()
  } catch (err) {
    console.error('Database seeding error: ', err)
  }
}

seedDatabase()
