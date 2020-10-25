const express = require('express')

const routes = express.Router()

const PeerController = require('./controllers/PeerController')

routes.get('/resources', PeerController.resources)
routes.get('/resource/:id', PeerController.resource)
routes.get('/health', PeerController.healthCheck)
routes.post('/peer', PeerController.post)



module.exports = routes