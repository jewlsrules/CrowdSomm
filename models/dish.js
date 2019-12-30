const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  dishName:
    { type: String, required: true },
  type:
    { type: String, required: true },
  restaurant:
    { type: String, required: true },
  ratings:
    { type: Array},
  reviews:
    { type: Array }, //this might not be right, need to reference songbirds project
})

//hey mongoose, set up our model!
const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
