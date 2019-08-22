'use strict'

const express = require('express')
const createError = require('http-errors')

const router = express.Router()

const Container = require('../models/containers')
const User = require('../models/user')

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin
} = require('../helpers/middlewares')

router.post(
  '/newContainer',
  async (req, res, next) => {
    const { service, filled, waste, capacity, ubicacio, dataEntrega, dataRetirada } = req.body
    try {
      const user = await User.findOne({ isAdmin: true })
      try {
        const newContainer = await Container.create({ service, filled, waste, capacity, ubicacio, dataEntrega, dataRetirada, client: req.session.currentUser._id })
        req.session.currentUser.activeContainers.unshift(newContainer)
        await User.findByIdAndUpdate(user._id, { $push: { activeContainers: newContainer._id } })
        const userUpdate = await User.findByIdAndUpdate(req.session.currentUser._id, { $push: { activeContainers: newContainer._id } })
        res.status(200).json(userUpdate)
      } catch (error) {
        next(error)
      }
    } catch (error) {
      next(error)
    }
  }
)

router.post(
  '/acceptContainer',
  async (req, res, next) => {
    const { _id, name } = req.body
    try {
      const containerUpdate = await Container.findByIdAndUpdate(_id, { isAccepted: true })
      await User.findOneAndUpdate({ username: name }, { $push: { activeContainers: _id } })
      const adminUpdate = await User.findOneAndUpdate({ isAdmin: true }, { $pull: { activeContainers: _id } })
      const clientId = containerUpdate.client
      await User.findByIdAndUpdate(clientId, { $pull: { activeContainers: _id } })
      res.status(200).json(adminUpdate)
    } catch (error) {
      next(error)
    }
  }
)

router.post(
  '/deleteContainer',
  async (req, res, next) => {
    const { containerId } = req.body
    try {
      const containerObj = await Container.findById(containerId)
      const clientId = containerObj.client
      await Container.findByIdAndDelete(containerId)
      await User.findOneAndUpdate({ isAdmin: true }, { $pull: { activeContainers: containerId } })
      const userUpdate = await User.findByIdAndUpdate(clientId, { $pull: { activeContainers: containerId } })
      res.status(200).json(userUpdate)
    } catch (error) {
      next(error)
    }
  }
)

router.post(
  '/modifyContainer',
  async (req, res, next) => {
    const { features, containerId } = req.body
    const { service, filled, waste, capacity, ubicacio, dataEntrega, dataRetirada } = features
    console.log(service, filled, waste, capacity, ubicacio, dataEntrega, dataRetirada, containerId)
    try {
      await Container.findByIdAndUpdate(containerId, { service, filled, waste, capacity, ubicacio, dataEntrega, dataRetirada })
    } catch (error) {
      next(error)
    }
  }
)
router.post(
  '/updateContainerToDelivered',
  async (req, res, next) => {
    const { _id, name } = req.body
    try {
      console.log(_id, name)
      const transporterUpdate = await User.findOneAndUpdate({ username: name }, { $pull: { activeContainers: _id } })
      const containerUpdate = await Container.findByIdAndUpdate(_id, { isDelivered: true, transporter: transporterUpdate._id })
      const clientId = containerUpdate.client
      await User.findByIdAndUpdate(clientId, { $push: { activeContainers: _id } })
      res.status(200).json(transporterUpdate)
    } catch (error) {
      next(error)
    }
  }
)
router.post(
  '/requestCollection',
  async (req, res, next) => {
    const { containerId } = req.body
    try {
      const container = await Container.findById(containerId)
      await User.findByIdAndUpdate(container.transporter, { $push: { activeContainers: containerId } })
      const clientUpdate = await User.findByIdAndUpdate(container.client, { $pull: { activeContainers: containerId } })
      res.status(200).json(clientUpdate)
    } catch (error) {
      next(error)
    }
  }
)
router.post(
  '/updateContainerToCollected',
  async (req, res, next) => {
    const { containerId } = req.body
    try {
      console.log(containerId)
      const container = await Container.findById(containerId)
      const transporterUpdate = await User.findByIdAndUpdate(container.transporter, { $pull: { activeContainers: containerId } })
      await User.findByIdAndUpdate(container.transporter, { $push: { archivedContainers: containerId } })
      await User.findByIdAndUpdate(container.client, { $push: { archivedContainers: containerId } })
      res.status(200).json(transporterUpdate)
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router
