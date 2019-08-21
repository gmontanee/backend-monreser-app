'use strict';

const express = require('express');
const createError = require('http-errors');

const router = express.Router();

const Container = require('../models/containers');
const User = require('../models/user');

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin
} = require('../helpers/middlewares');

router.post(
  '/newContainer',
  // isLoggedIn(),
  async (req, res, next) => {
    const {service, filled, waste, capacity, ubicacio, dataEntrega, dataRetirada} = req.body;
    try {
      const user = await User.findOne({ isAdmin: true });
      try {
        console.log
        const newContainer = await Container.create({ service, filled, waste, capacity, ubicacio, dataEntrega, dataRetirada});
        req.session.currentUser.activeContainers.unshift(newContainer);
        await User.findByIdAndUpdate(user._id, {$push: { activeContainers: newContainer._id} }).populate("activeContainers");
        await User.findByIdAndUpdate(req.session.currentUser._id, {$push: { activeContainers: newContainer._id} }).populate("activeContainers");
        console.log(req.session.currentUser.activeContainers);
        res.status(200).json(req.session.currentUser);
    } catch (error) {
      next(error);
    } } catch (error) {
        next(error);
    }
  }
); 

module.exports = router;