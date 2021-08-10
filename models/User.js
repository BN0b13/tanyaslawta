const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});



// first parameter is folder name in DB Collection, second is const/function called
module.exports = mongoose.model('users', UserSchema);