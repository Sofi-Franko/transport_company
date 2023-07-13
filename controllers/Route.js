const Route = require("../models/Route")
const Transport = require("../models/Transport")

module.exports = class RouteController {
  async list(req, res) {
    const query = Route.find();

    if (req.query.status) {
      query.where("status").equals(req.query.status);
    }
    if (req.query.startCity) {
      query.where("startCity", new RegExp(req.query.startCity, "i"));
    }
    if (req.query.endCity) {
      query.where("endCity", new RegExp(req.query.endCity, "i"));
    }

    const sort = {}
    if (req.query.revenue) {
      sort.revenue = req.query.revenue === 'asc' ? 1 : -1
    }
    if (req.query.dispatchDate) {
      sort.dispatchDate = req.query.dispatchDate === 'asc' ? 1 : -1
    }
    if (req.query.executionDate) {
      sort.executionDate = req.query.executionDate === 'asc' ? 1 : -1
    }
    query.sort(sort);

    try {
      const routes = await query.exec();
      return res.status(200).json(routes)
    } catch (err) {
      console.log(`the-------------------> err`, err)
      return res.status(500).json({ error: 'Error fetching route list' })
    }
  }

  async findOne(req, res) {
    try {
      const route = await Route.findOne({id: req.params.id})
      if (route) {
        res.status(200).json(route)
      } else {
        res.status(404).json({error: 'Route not found'})
      }
    } catch (err) {
      res.status(500).json({error: 'Error fetching route details'})
    }
  }

  async create(req, res) {
    if (req.body.transportId) {
      const transport = await Transport.findOne({ id: req.body.transportId })

      if (!transport) {
        return res.status(404).json({ error: 'Transport not found' })
      }
      if (transport.status === 'busy') {
        return res
          .status(400)
          .json({ error: 'Cannot assign a busy transport to a new route' })
      }
      if (transport.type !== req.body.transportType) {
        return res
          .status(400)
          .json({ error: 'Transport type and route transport type must match' })
      }
    }

    if (!req.body.status) {
      req.body.status = "awaiting shipment"
    }

    try {
      const newRoute = new Route(req.body)
      const savedRoute = await newRoute.save()
      return res.status(201).json(savedRoute)
    } catch (err) {
      console.log(`the-------------------> err`, err)
      return res.status(500).json({ error: 'Error creating new route' })
    }
  }

  async update(req, res) {
    const route = await Route.findOne({id: req.params.id})
    if (!route) {
      res.status(404).json({error: 'Route not found'})
    }

    if (route.transportId && req.body.status === "completed") {
      try {
        await Transport.updateOne({ id: route.transportId }, { status: "free" })
      } catch (e) {
        res.status(500).json({ error: 'Error updating old transport status to \"free\"' })
      }
    }

    try {
      const updatedRoute = await Route.updateOne(
        { id: req.params.id },
        { $set: req.body }
      )
      res.status(200).json(updatedRoute)
    } catch (err) {
      res.status(500).json({ error: 'Error updating route' })
    }
  }

  async delete(req, res) {
    const route = await Route.findOne({ id: req.params.id })

    if (!route) {
      return res.status(404).json({ error: 'Route not found' })
    }

    if (route.status === 'in progress') {
      return res.status(400).json({ error: 'Can not delete route already in progress' })
    }

    if (route.transportId) {
      try {
        await Transport.updateOne({ id: route.transportId }, { status: "free" })
      } catch (e) {
        res.status(500).json({ error: 'Error updating transport status to \"free\"' })
      }
    }

    try {
      await Route.deleteOne({ id: req.params.id })
      res.status(200).json({ message: 'Route deleted successfully' })
    } catch (err) {
      res.status(500).json({ error: 'Error deleting route' })
    }
  }
}
