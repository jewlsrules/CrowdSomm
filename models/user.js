const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:
    { type: String, required: true },
  email:
    { type: String, required: true, unique: true},
  username:
    { type: String, required: true, unique: true},
  password:
    { type: String, required: true },
})

//hey mongoose, set up our model!
const User = mongoose.model('User', userSchema);

module.exports = User;
