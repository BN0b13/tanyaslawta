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
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  isLoggedIn: {
    type: Boolean,
    required: false
  }
});



// first parameter is folder name in DB Collection, second is const/function called
module.exports = mongoose.model('users', UserSchema);