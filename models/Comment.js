const mongoose = require('mongoose');


const CommentSchema = mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  postID: {
    type: String,
    required: true
  }
});



// first parameter is folder name in DB Collection, second is const/function called
module.exports = mongoose.model('comments', CommentSchema);