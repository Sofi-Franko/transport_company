const Transport = require("../models/Transport")
const Route = require("../models/Route")

module.exports = class TransportController {
  async list(req, res) {
    const query = Transport.find();

    if (req.query.status) {
      query.where("status").equals(req.query.status);
    }
    if (req.query.type) {
      query.where("type").equals(req.query.type);
    }

    query.sort({mileage: -1});

    try {
      const transports = await query.exec();
      return res.status(200).json(transports)
    } catch (err) {
      return res.status(500).json({error: 'Error fetching transport list'})
    }
  }

  async findOne(req, res) {
    try {
      const transport = await Transport.findOne({id: req.params.id})
      if (transport) {
        return res.status(200).json(transport)
      } else {
        return res.status(404).json({error: 'Transport not found'})
      }
    } catch (err) {
      return res.status(500).json({error: 'Error fetching transport details'})
    }
  }

  async create(req, res) {
    try {
      const newTransport = new Transport(req.body)
      const savedTransport = await newTransport.save()
      return res.status(201).json(savedTransport)
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({error: 'licensePlate field is required'})
      } else if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(400).json({error: 'licensePlate must be unique'})
      } else {
        return res.status(500).json({error: 'Error creating new transport'})
      }
    }
  }

  async update(req, res) {
    if (!req.body.licensePlate) {
      return res.status(400).json({error: 'licensePlate field is required'})
    }

    const existingTransport = await Transport.findOne({
      licensePlate: req.body.licensePlate,
    })

    if (existingTransport && String(existingTransport.id) !== req.params.id) {
      return res.status(400).json({error: 'licensePlate must be unique'})
    }

    try {
      const updatedTransport = await Transport.updateOne(
        {id: req.params.id},
        {$set: req.body}
      )
      return res.status(200).json(updatedTransport)
    } catch (err) {
      return res.status(500).json({error: 'Error updating transport'})
    }
  }

  async delete(req, res) {
    const transport = await Transport.findOne({id: req.params.id})

    if (!transport) {
      return res.status(404).json({error: 'Transport not found'})
    }

    if (transport.status === 'busy') {
      return res
        .status(400)
        .json({error: 'Deletion is possible only if transport status is busy'})
    }

    try {
      await Transport.deleteOne({id: req.params.id})
      return res.status(200).json({message: 'Transport deleted successfully'})
    } catch (err) {
      return res.status(500).json({error: 'Error deleting transport'})
    }
  }

  async assign(req, res) {
    const {transportId, routeId, transportType} = req.body

    if (!transportId || !routeId || !transportType) {
      return res
        .status(400)
        .json({error: 'routeId, transportId and transportType are required in the request body'})
    }

    const route = await Route.findOne({id: routeId})
    if (!route) {
      return res.status(404).json({error: 'Route not found'})
    }

    if (route.status === "in progress") {
      return res
        .status(400)
        .json({error: 'The route already has an assigned transport'})
    }

    const transport = await Transport.findOne({id: transportId})
    if (!transport) {
      return res.status(404).json({error: 'Transport not found'})
    }

    if (transport.status === 'busy') {
      return res.status(400).json({error: 'The transport is busy and cannot be assigned'})
    }

    if (transportType !== transport.type) {
      return res
        .status(400)
        .json({error: 'Transport type and route transport type must match'})
    }

    if (route.transportId !== transport.id) {
      if (transport.status === "busy") {
        return res
          .status(400)
          .json({error: 'Cannot assign a busy transport to an existing route'})
      }

      try {
        transport.status = "busy";
        await transport.save();
      } catch (e) {
        res.status(500).json({ error: 'Error updating new transport status to \"busy\"' })
      }
    }

    if (route.transportId) {
      try {
        await Transport.updateOne({ id: route.transportId }, { status: "free" })
      } catch (e) {
        res.status(500).json({ error: 'Error updating old transport status to \"free\"' })
      }
    }

    try {
      await Route.updateOne(
        {id: routeId},
        {$set: {transportId, transportType, status: 'in progress'}}
      )

      await Transport.updateOne({id: transportId}, {$set: {status: 'busy'}})

      res.status(200).json({message: 'Transport assigned successfully to the route'})
    } catch (err) {
      res.status(500).json({error: 'Error assigning transport to the route'})
    }
  }
}
