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
//show sign up page
router.get('/', (req, res) => {
  res.render('restaurants/restaurant.ejs')
}) // end of show sign up page

//----------------------
// Export
//----------------------
module.exports = router;
