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

invalid = false;

//----------------------
// Routes
//----------------------

// Show Log In Page
router.get('/login', (req, res) => {
  if(!req.session.username){
    res.render('sessions/login.ejs', {
      invalid: invalid
    })
  } else {
    res.redirect('/')
  }
}) // end of show log in page



//----------------------
// Export
//----------------------
module.exports = router;
