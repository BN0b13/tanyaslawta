const mongoose = require('mongoose');


const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});



// first parameter is folder name in DB Collection, second is const/function called
module.exports = mongoose.model('posts', PostSchema);