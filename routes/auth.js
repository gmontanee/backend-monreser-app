'use strict'

const express = require('express')
const createError = require('http-errors')

const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin
} = require('../helpers/middlewares')

router.get('/me', isLoggedIn(), async (req, res, next) => {
  console.log(req.session.currentUser.activeContainers)
  const currentUser = await User.findById(req.session.currentUser._id).populate('activeContainers')
  console.log(currentUser.activeContainers)
  // User find populate
  res.json(currentUser)
})

router.post(
  '/login',
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { username, password } = req.body

    try {
      const user = await User.findOne({ username })
      if (!user) {
        console.log('here')
        next(createError(404))
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user
        return res.status(200).json(user)
      } else {
        next(createError(401))
      }
    } catch (error) {
      next(error)
    }
  }
)

router.post(
  '/signup',
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { email, password, username, direction, country, region, town, postalCode } = req.body
    console.log('signup client done')
    try {
      const user = await User.findOne({ username }, 'username')
      if (user) {
        return next(createError(422))
      } else {
        const salt = bcrypt.genSaltSync(10)
        const hashPass = bcrypt.hashSync(password, salt)
        const newUser = await User.create({ username, password: hashPass, email, direction, country, region, town, postalCode })
        req.session.currentUser = newUser
        res.status(200).json(newUser)
      }
    } catch (error) {
      next(error)
    }
  }
)

router.post(
  '/signup192837',
  async (req, res, next) => {
    console.log(req.body)
    const { email, password, username } = req.body

    try {
      const user = await User.findOne({ username }, 'username')
      if (user) {
        return next(createError(422))
      } else {
        const salt = bcrypt.genSaltSync(10)
        const hashPass = bcrypt.hashSync(password, salt)
        const newAdminUser = await User.create({ username, password: hashPass, email, isAdmin: true })
        req.session.currentUser = newAdminUser
        res.status(200).json(newAdminUser)
      }
    } catch (error) {
      next(error)
    }
  }
)

router.post(
  '/signuptransporter192837',
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { email, password, username, direction, country, region, town, postalCode } = req.body
    console.log('signup transporter done')
    try {
      const user = await User.findOne({ username }, 'username')
      if (user) {
        return next(createError(422))
      } else {
        const salt = bcrypt.genSaltSync(10)
        const hashPass = bcrypt.hashSync(password, salt)
        const newUser = await User.create({ username, password: hashPass, email, direction, country, region, town, postalCode, isTransporter: true })
        req.session.currentUser = newUser
        res.status(200).json(newUser)
      }
    } catch (error) {
      next(error)
    }
  }
)

router.post('/logout', isLoggedIn(), (req, res, next) => {
  delete req.session.currentUser
  return res.status(204).send()
})

router.get('/private', isLoggedIn(), (req, res, next) => {
  res.status(200).json({
    message: 'This is a private message'
  })
})

module.exports = router
