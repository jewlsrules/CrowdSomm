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
var rp = require('request-promise');

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
  console.log('1. id: ', req.params.id);
  //this is the search for the business in Yelp's API
  client.business(req.params.id)
    .then(response => {
      console.log("2. ", response.jsonBody);
      req.session.restaurant = response.jsonBody;
      //using the options from above, get the data from php backend
      rp({uri: 'https://crowdsommphp.herokuapp.com/api/reviews/restid/'+req.params.id, json: true}).then(function (repos) {
        console.log('repos: ', repos); // Print the responses
        req.session.reviews = repos
      }).then(() => {
        console.log('page loading now');
        res.render('restaurants/show.ejs', {
          restaurant_name: req.session.restaurant.name,
          restaurant_address: req.session.restaurant.location[0],
          restaurant_id: req.session.restaurant.id,
          user: req.session.username,
          reviews: req.session.reviews
        })
      })
    }).catch(e => {
      console.log("this is the error: ", e);
    });
    console.log('6. reviews cookie: ', req.session.reviews);
})

router.get('/:id/newreview', (req, res) => {
  req.session.restuarant_id = req.params.id;
  client.business(req.params.id)
    .then(response => {
      console.log('yelp api call');
      console.log("full response: ", response.jsonBody);
      req.session.restuarant = response.jsonBody;
    }).then(() => {
      console.log('page loading now');
      res.render('restaurants/newreview.ejs', {
        restaurant_id: req.session.restuarant.id,
        restaurant_name: req.session.restaurant.name,
        user: req.session.username,
      })
    }).catch(e => {
      console.log("this is the error: ", e);
    });
})

//----------------------
// Export
//----------------------
module.exports = router;
