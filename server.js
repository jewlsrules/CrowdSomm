//----------------------
//Dependencies
//----------------------
const express = require('express');
const app = express();

//----------------------
//PORT
//----------------------
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT

//----------------------
// Database
//----------------------
// // How to connect to the database either via heroku or locally
// const MONGODB_URI = process.env.MONGODB_URI
//
// // Connect to Mongo &
// // Fix Depreciation Warnings from Mongoose
// // May or may not need these depending on your Mongoose version
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
//
// // Error / success
// db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
// db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
// db.on('disconnected', () => console.log('mongo disconnected'));

//----------------------
// Middleware
//----------------------
// //setting up cookies
// app.use(session({
//   //random string
//   secret:'onetwofreddyscomingforyou',
//   //dont worry about why this is false, just set it false
//   resave:false,
//   //dont worry about why this is false, just set it false
//   saveUninitialized:false
// }))
//
// //use public folder for static assets
// app.use(express.static('public'));
//
// // populates req.body with parsed info from forms - if no data from forms will return an empty object {}
// app.use(express.urlencoded({ extended: true }));// extended: false - does not allow nested objects in query strings
// // app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project - THIS IS FOR APIS
//
// //use method override
// app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form
//
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
// // Users controller
// const usersController = require('./controllers/users.js');
// app.use('/users', usersController)
//
// //----------------------
// // Routes
// //----------------------
//
//basic route
app.get('/' , (req, res) => {
  res.send('working!')
});


//----------------------
// Listener
//----------------------
app.listen(3000, () => console.log( 'Listening on port:', 3000));
