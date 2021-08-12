const mongoose = require('mongoose');


const PostSchema = mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: false
  }
});



// first parameter is folder name in DB Collection, second is const/function called
module.exports = mongoose.model('posts', PostSchema);