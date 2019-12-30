const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName:
    { type: String, required: true },
  lastName:
    { type: String, required: true },
  email:
    { type: String, required: true },
  username:
    { type: String, required: true, unique: true},
  password:
    { type: String, required: true },
})

//hey mongoose, set up our model!
const User = mongoose.model('User', userSchema);

module.exports = User;
