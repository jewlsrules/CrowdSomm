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
//
// // Show Edit Page
// router.get('/:id/edit', (req, res) => {
//   if(req.session.username){ //make sure the user is signed in based on the cookie
//     if(req.session.username === req.params.id) {
//       User.findOne({username: req.params.id}, (error, foundUser) => { // find the User and render the edit page
//         console.log(foundUser)
//         res.render('users/editprofile.ejs', {
//           user: foundUser
//         })
//       })
//       //if the user tries to edit someone else's profile, send them to home
//     } else {
//       res.redirect('/projects/all')
//     }
//   } else { //if the user isn't signed in bring them to the sign up/log in page
//     res.redirect('/projects/all')
//   }
// }) // end of show edit project site
//
// // Edit a project action route
// router.put('/:id', (req, res) => {
//   // console.dir(req.body);
//   // res.redirect('/users/'+req.params.id)
//     User.findOneAndUpdate(
//       {username: req.params.id},
//       req.body,
//       { new: true }, (error, updatedModel) => {
//         res.redirect('/users/'+req.params.id)
//       })
// }) // end of edit action route
//
//homepage
router.get('/', (req, res) => {
  res.redirect('/')
})
//
// //show user's page
// router.get('/:id', (req, res) => {
//   //check if the user is loggedin first
//   if(req.session.username){
//     //find the user and display their information
//     User.findOne({username: req.params.id}, (error, foundUser) => {
//       // console.log('req.session.username = ' + req.session.username);
//       // console.log('found user\'s username is: ' + foundUser);
//       Project.find({user: req.params.id}, (error, foundProjects) => {
//         //to see and edit their own profile
//         if(req.session.username === foundUser.username){
//           res.render('users/profile.ejs', {
//             user:foundUser,
//             projects:foundProjects
//           })
//           //to view another user's profile
//         } else {
//           res.render('users/otherprofile.ejs', {
//             user:foundUser,
//             projects:foundProjects,
//             loggedInUser: req.session.username
//           })
//         }
//       })
//     })
//   } else {
//     res.redirect('/')
//   }
// })//end of user's show page

//----------------------
// Export
//----------------------
module.exports = router;
