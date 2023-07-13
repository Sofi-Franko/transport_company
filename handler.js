const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const TransportController = new (require("./controllers/Transport"))()
const RouteController = new (require("./controllers/Route"))()

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Mongodb connection
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongoose.Promise = global.Promise

// API routes
app.get('/routes', RouteController.list); // get the list of routes
app.get('/transports', TransportController.list); // get the list of transports

app.get('/routes/:id', RouteController.findOne); // get route by id
app.get('/transports/:id', TransportController.findOne); // get transport by id

app.post('/routes', RouteController.create); // create a new route
app.post('/transports', TransportController.create); // create a new transport

app.put('/routes/:id', RouteController.update); // update a route
app.put('/transports/:id', TransportController.update); // update a transport

app.delete('/routes/:id',  RouteController.delete); // delete a route
app.delete('/transports/:id', TransportController.delete); // delete a transport

app.put('/assign-transport', TransportController.assign); // assign free transport to an available route

if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => console.log(`Local server running on port ${PORT}`))
}

module.exports = { path: '/api', handler: app }
