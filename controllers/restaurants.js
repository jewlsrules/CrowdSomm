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
const yelp = require('yelp-fusion'); //for the yelp API to get businesses listed
const base_url = 'https://crowdsommphp.herokuapp.com/api/';
const request = require('request');

require('dotenv').config()

//----------------------
// Routes
//----------------------

const YELP_API_KEY = process.env.YELP_API_KEY
const client = yelp.client(YELP_API_KEY)

//show restaurants page
router.get('/', (req, res) => {
  console.log('controller working');
  res.render('restaurants/restaurant.ejs', {
    user: req.session.username
  })
}) // end of show sign up page

router.get('/:id', (req, res) => {
  req.session.restuarant_id = req.params.id
  console.log('id: ', req.params.id);
  client.business(req.params.id)
    .then(response => {
    console.log(response.jsonBody.name);
    res.render('restaurants/show.ejs', {
      restaurant_name: response.jsonBody.name,
      restaurant_address: response.jsonBody.location.address1,
      user: req.session.username
    })
  }).catch(e => {
    console.log(e);
  });
})

router.get('/reviews/showall', (req, res) => {
  request('http://localhost:8888/reviews', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
  });
  res.render('restaurants/show.ejs', {
    restaurant_name: "Kesslers",
    restaurant_address: "Fake Address",
    user: req.session.username
  })
})

//----------------------
// Export
//----------------------
module.exports = router;
