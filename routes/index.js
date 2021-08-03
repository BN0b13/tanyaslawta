const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const session = requires('express-session');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

router.get('/', (req, res) => {
  const homepage = (path.join(process.cwd(), '/public/html/index.html'));
  res.sendFile(homepage);
});

router.get('/pets', (req, res) => {
  const petsPage = (path.join(process.cwd(), '/public/html/pets.html'));
  res.sendFile(petsPage);
});

router.get('/blogs', (req, res) => {
  const blogPage = (path.join(process.cwd(), '/public/html/blog.html'));
  res.sendFile(blogPage);
});

router.get('/blogs/api', (req, res) => {
  Post.find()
  .then(result=> {
    res.send(result);
  })
  .catch(error=> {
    res.send(error);
  });
});

router.post('/blog-post', async (req, res) => {
  const { title, description } = req.body;
  const post = new Post({
    title: title,
    description: description
  });
  // console.log(post);
  try {
    const savePost = await post.save();
    res.redirect('/blogs');
  } catch(err) {
    res.json( { message: err });
  };
});

router.post('/userCreate', async (req, res) => {
  const existingUser = await User.find( { 'user': req.body.user } );
  if(existingUser.length <= 0) {
    return console.log('User already exists');
  }
  // console.log(post);
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = req.body.user;
    const post = new User({
    user: user,
    password: hashedPassword
  });
    const savePost = await post.save();
    res.redirect('/');
  } catch(err) {
    res.json( { message: err });
  };
});

router.post('/userAuth', async (req, res) => {
  const userName = await User.find( { 'user': req.body.user } );

  console.log(userName);
  if(userName.length <= 0) {
    console.log('user not found');
  } else {
    const match = await bcrypt.compare(req.body.password, userName[0].password);

    if(match) {
        console.log('success!');
    } else {
      console.log('failed');
    }
  }
  
  // if (user == null) {
  //   return res.status(400).send('Cannot find user')
  // }
  // try {
  //   if(await bcrypt.compare(req.body.password, user.password)) {
  //     res.send('Sucess');
  //   } else {
  //     res.send('Login Failed');
  //   }
  // } catch {
  //   res.status(500).send();
  // }

  res.redirect('/');
})

router.delete('/:postId', async (req, res) => {
  try {
    const removedPost = await Post.deleteOne({_id: req.params.postId });
    res.json(removedPost);
  } catch(err) {
    res.json( { message: err });
  }
});

router.patch('/:postId', express.json(), async (req, res) => {
  try {
    const updatedPost = await Post.updateOne({_id: req.params.postId }, { $set: {title: req.body.title, description: req.body.description}});
    res.json(updatedPost);
  } catch(err) {
    res.json( { message: err });
  }
});

router.get('/about', (req, res) => {
  const aboutPage = (path.join(process.cwd(), '/public/html/about.html'));
  res.sendFile(aboutPage);
});

module.exports = router;






