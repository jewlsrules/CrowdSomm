//----------------------
//Dependencies
//----------------------
const express = require('express');
const app = express();
const methodOverride = require('method-override') //convert strings in forms
const mongoose = require('mongoose') //for database
const session = require('express-session') //for cookies
const bcrypt = require('bcrypt') //for password encryption
const yelp = require('yelp-fusion'); //for the yelp API to get businesses listed
const base_url = 'https://crowdsommphp.herokuapp.com/api/'

const db = mongoose.connection
require('dotenv').config()

//----------------------
//PORT
//----------------------
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT

//----------------------
// Database
//----------------------
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// ----------------------
// Middleware
// ----------------------

//yelp API
const YELP_API_KEY = process.env.YELP_API_KEY
const client = yelp.client(YELP_API_KEY)

//setting up cookies
app.use(session({
  //random string
  secret:'onetwofreddyscomingforyou',
  //dont worry about why this is false, just set it false
  resave:false,
  //dont worry about why this is false, just set it false
  saveUninitialized:false
}))

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: true }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON  - THIS IS FOR APIS

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form

// //----------------------
// // Controllers
// //----------------------

// // Sessions controller
// const sessionsController = require('./controllers/sessions.js');
// app.use('/sessions', sessionsController)
//
// Users controller
const usersController = require('./controllers/users.js');
app.use('/users', usersController)

//restaurants
const restaurantsController = require('./controllers/restaurants.js');
app.use('/restaurants', restaurantsController)

// //----------------------
// // Routes
// //----------------------

let business = null
let businesses = null

app.post('/search', (req, res) => {
  // console.log(req.body.restaurant_name)
  //the search term and location is set as cookies
  req.session.search_term = req.body.restaurant_name;
  req.session.location = req.body.restaurant_location;
  res.redirect('/')
})

app.get('/' , (req, res) => {
  console.log("search term cookie: ", req.session.search_term)
  //if there isn't a search term entered, show nothing.
  if(!req.session.search_term){
    res.render('home.ejs', {
      user: req.session.username,
      businesses: null
    });
    //if there is a search term, show the restaurant list
  } else {
    client.search({
      //use the cookies we set in the post above
      term: req.session.search_term,
      location: req.session.location,
    }).then(response => {
      // console.log(response.jsonBody.businesses);
      businesses = response.jsonBody.businesses;
      business = response.jsonBody.businesses[0];
      // console.log('req.session.search_term ' , req.session.search_term);
      res.render('home.ejs', {
        user: req.session.username,
        businesses: businesses,
        business: business
      })
    }).catch(e => {
      console.log(e);
    });
  }
});

//----------------------
// Listener
//----------------------
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
