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
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project - THIS IS FOR APIS

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form

// //----------------------
// // Controllers
// //----------------------
// // Projects controller
// const patternsController = require('./controllers/projects.js');
// app.use('/projects', patternsController)
//
// // Sessions controller
// const sessionsController = require('./controllers/sessions.js');
// app.use('/sessions', sessionsController)
//
// Users controller
const usersController = require('./controllers/users.js');
app.use('/users', usersController)
//
// //----------------------
// // Routes
// //----------------------
//

let business = null
let businesses = null
//starting search name to null
let search_term = null
//starting search  location is null
let location = null

app.post('/search', (req, res) => {
  console.log(req.body.restaurant_name)
  search_term = req.body.restaurant_name;
  location = req.body.restaurant_location;
  res.redirect('/')
})

app.get('/' , (req, res) => {
  //if there isn't a search term entered, show nothing.
  if(!search_term){
    res.render('home.ejs', {
      user: req.session.username,
      businesses: null
    });
    //if there is a search term, show the
  } else {
    client.search({
      term: search_term,
      location: location,
    }).then(response => {
      // console.log(response.jsonBody.businesses);
      businesses = response.jsonBody.businesses;
      business = response.jsonBody.businesses[0];
      console.log('list of businesses: ' , businesses);
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

// <h3><%=businesses[i].name%></h3><p><%=businesses[i].location.address1%></p>
//----------------------
// Listener
//----------------------
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
