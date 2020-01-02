//----------------------
// Dependencies
//----------------------
const express = require('express');
const router = express();
const methodOverride = require('method-override') //convert strings in forms
const mongoose = require('mongoose') //for database
const session = require('express-session') //for cookies
const bcrypt = require('bcrypt') //for password encryption
const User = require('../models/user.js')

//----------------------
// Routes
//----------------------
//show restaurants page
router.get('/', (req, res) => {
  console.log('controller working');
  res.render('restaurants/restaurant.ejs', {
    user: req.session.username
  })
}) // end of show sign up page

router.get('/:id', (req, res) => {
  req.session.restuarant_id = req.params.id
  res.render('restaurants/show.ejs', {
    restaurant_id: req.session.restaurant_id,
    user: req.session.username
  })
})

//----------------------
// Export
//----------------------
module.exports = router;
