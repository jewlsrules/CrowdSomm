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
    user: req.session.user
  })
}) // end of show sign up page

//show individual restaurant page
router.get('/:id', (req, res) => {
  req.session.restuarant_id = req.params.id
  // console.log('1. id: ', req.params.id);
  //this is the search for the business in Yelp's API
  client.business(req.params.id)
    .then(response => {
      // console.log("2. ", response.jsonBody);
      req.session.restaurant = response.jsonBody;
      //using the options from above, get the data from php backend
      rp({uri: 'https://crowdsommphp.herokuapp.com/api/reviews/restid/'+req.params.id, json: true}).then(function (repos) {
        // console.log('repos: ', repos); // Print the responses
        req.session.reviews = repos
        // console.log('repos are here!', repos);
      }).then(() => {
        //this is getting just the rating and id so we can get the averages.
        let array1 = req.session.reviews;
        array1.sort();
        let reviews_ratings = array1.map(item => {
          const container = {};
          container.dish_id = item.dish_id;
          container.stars = item.stars;
          container.dish_name = item.dish_name
          return container
        })
        console.log(reviews_ratings);
        let finals = [];
        let findaverages = () => {
          let dish_name_tracker = reviews_ratings[0].dish_name;
          let total_sum = 0;
          let dish_id_tracker = reviews_ratings[0].dish_id;
          let counter = 0;
          for(let i = 0; i<(reviews_ratings.length); i++){
            console.log(i+' - dish_id:'+ reviews_ratings[i].dish_id);
            // if the dish_id matches the tracker, add the stars to the sum.
            if(i==(reviews_ratings.length-1)){
              total_sum += reviews_ratings[i].stars;
              counter++
              dish_name_tracker = reviews_ratings[i].dish_name;
              dish_id_tracker = reviews_ratings[i].dish_id
              const container1 = {};
              container1.dish_name = dish_name_tracker;
              container1.dish_id = dish_id_tracker;
              container1.sum = total_sum;
              container1.counter = counter;
              container1.avgStars = total_sum/counter;
              finals.push(container1);
              dish_id_tracker = reviews_ratings[i].dish_id;
              total_sum = reviews_ratings[i].stars;
              counter = 1;
              console.log(i+'- last one!');
              //if the ID matches a previous one, just increase the sum and counter.
            } else if(reviews_ratings[i].dish_id === dish_id_tracker){
              //add the star rating to the sum.
              console.log(i+' - review stars:'+ reviews_ratings[i].stars+' totalsum:'+total_sum+' counter='+counter);
              total_sum += reviews_ratings[i].stars;
              counter++
              //if it's a new one,
            } else {
              const container1 = {};
              container1.dish_name = dish_name_tracker;
              container1.dish_id = dish_id_tracker;
              container1.sum = total_sum;
              container1.counter = counter;
              container1.avgStars = total_sum/counter;
              finals.push(container1);
              dish_id_tracker = reviews_ratings[i].dish_id;
              total_sum = reviews_ratings[i].stars;
              counter = 1;
              console.log(i+' - no match!');
              // console.log(finals);
            }
            console.log(finals);
          }
        }
        //run the above function
        if (reviews_ratings[0]) {
          findaverages();
        }
        // console.log('page loading now');
        // console.log('user cookie: ', req.session.user);
          res.render('restaurants/show.ejs', {
            restaurant_name: req.session.restaurant.name,
            restaurant_address: req.session.restaurant.location[0],
            restaurant_id: req.session.restaurant.id,
            user: req.session.user,
            reviews: req.session.reviews,
            averages: finals
          })
      })
    }).catch(e => {
      console.log("this is the error: ", e);
    });
}) // end of show individual restaurant

//show page for adding a new review
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
        user: req.session.user,
      })
    }).catch(e => {
      console.log("this is the error: ", e);
    });;
}) // end of new review show page

//show page for adding a new review on an existing dish
router.get('/:restaurantid/:dishid', (req, res) => {
  // req.session.restuarant_id = req.params.restaurantid;
  // console.log(req.session);
  rp({uri: 'https://crowdsommphp.herokuapp.com/api/reviews/restid/'+req.params.restuarantid, json: true}).then(function (repos) {
    // console.log('repos: ', repos); // Print the responses
    req.session.reviews = repos
    // console.log('repos are here!', repos);
  }).then(() => {
    res.render('restaurants/review.ejs', {
      restaurant_id: req.params.restaurantid,
      restaurant_name: req.session.restaurant.name,
      dish_id: req.params.dishid,
      user: req.session.user,
    })
  })
}) // end of new review show page

let request1

router.post('/:id/newreview', (req, res) => {
  console.log(req.body); //this returns an object based on the names of the inputs
  request1 = {
      method: 'POST',
      uri: 'https://crowdsommphp.herokuapp.com/api/reviews',
      body: {
          user_id: req.session.user._id,
          restaurant_id: req.params.id,
          dish_name: req.body.dish_name,
          dish_id: 875, //we need to change this!!
          stars: req.body.stars,
          review_text: req.body.review_text
      },
      json: true // Automatically stringifies the body to JSON
  };
  console.log(request1);
  rp(request1)
    .then(function (parsedBody) {
      console.log('success! i think.');
        // POST succeeded...
    })
    .then(() => {
      res.redirect('/restaurants/'+req.params.id)
    })
    .catch(e => {
      console.log("this is the error: ", e);
    });
});

router.get('/:restuarant_id/:review_id', (req, res) => {
  request1 = {
    method: 'DELETE',
    uri: 'https://crowdsommphp.herokuapp.com/api/reviews/'+req.params.review_id
  };
  rp(request1)
    .then(function (parsedBody) {
      console.log('success! i think.');
        // POST succeeded...
    })
    .then(() => {
      res.redirect('/')
    })
    .catch(e => {
      console.log("this is the error: ", e);
    });
})

//----------------------
// Export
//----------------------
module.exports = router;
