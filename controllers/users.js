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
const base_url = 'https://crowdsommphp.herokuapp.com/api/'

//----------------------
// Routes
//----------------------
//show sign up page
router.get('/signup', (req, res) => {
  res.render('users/signup.ejs')
}) // end of show sign up page

// //create new user route
router.post('/', (req, res) => {
  // encrypt the password before passing it into the new user object
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  User.create(req.body, (error, createdUser) => {
    // set the cookie so that we know the user is logged in
    req.session.username = createdUser.username
    console.log('created user.id: ', createdUser.id)
    console.log('req.session: ', req.session)
    //bring the new user to the main page
    res.redirect('/')
  })
}) // end of create new user route

let invalid

// Show Log In Page
router.get('/login', (req, res) => {
  if(!req.session.username){
    res.render('users/login.ejs', {
      user: req.session.username,
      invalid: invalid
    })
  } else {
    res.redirect('/')
  }
}) // end of show log in page

// Log In route
router.post('/login', (req, res)=>{
  console.log('logging in:', req.body);
  User.findOne({username: req.body.login_username}, (error, foundUser) => {
    if(foundUser === null){
      invalid = true;
      res.redirect('/users/login')
    } else {
      const doesPasswordMatch = bcrypt.compareSync(req.body.login_password, foundUser.password)
      if(doesPasswordMatch){
        //if the password is correct, set a cookie of their username
        // console.log("this is the log in post route, found user is : "+ foundUser);
        req.session.username = foundUser.username
        console.log('logged in user: ', req.session)
        res.redirect('/')
      } else {
        invalid = true;
        res.redirect('/users/login')
      }
    }
  })
}) // end of log in check route

//homepage
router.get('/', (req, res) => {
  res.redirect('/')
})

//----------------------
// Export
//----------------------
module.exports = router;
