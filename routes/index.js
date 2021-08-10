const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

const seshCheck = (req, res, next) => {
  if(!req.session.isLoggedIn){
    return res.redirect(`/login`);
  }
  // const isLoggedIn = req.session.isLoggedIn ? req.session.isLoggedIn : false;
  // if( req.session && !isLoggedIn) {
  //   res.redirect('/');
  // } 
  next();
}

router.get('/', seshCheck, (req, res) => {
  const homepage = (path.join(process.cwd(), '/public/html/index.html'));
  res.sendFile(homepage);
});

router.get('/login', (req, res) => {
  if(req.session.isLoggedIn){
    return res.redirect(`/`);
  }
  const loginPage = (path.join(process.cwd(), '/public/html/login.html'));
  res.sendFile(loginPage);
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {err});
  res.redirect(`/login`);
});

router.get('/explore', (req, res) => {
  const explorePage = (path.join(process.cwd(), '/public/html/explore.html'));
  res.sendFile(explorePage);
});

router.get('/content/:postId', async (req, res) => {
  const contentPage = (path.join(process.cwd(), '/public/html/content.html'));
  res.sendFile(contentPage);
});

router.get('/profile/api', (req, res) => {
  Post.find( { 'userID': req.session.userID } )
  .then(result=> {
    res.send(result);
  })
  .catch(error=> {
    res.send(error);
  });
});

router.get('/profile-user/api', (req, res) => {
  User.find( { '_id': req.session.userID } )
  .then(result=> {
    res.send(result);
  })
  .catch(error=> {
    res.send(error);
  });
});

router.get('/posts/api', (req, res) => {
  Post.find()
  .then(result=> {
    res.send(result);
  })
  .catch(error=> {
    res.send(error);
  });
});

router.post('/new-post', async (req, res) => {
  const { title, body } = req.body;
  const userID = req.session.userID;
  const user = req.session.user;

  const post = new Post({
    userID: userID,
    user: user,
    title: title,
    body: body
  });
  try {
    const savePost = await post.save();
    res.redirect('/');
  } catch(err) {
    res.json( { message: err });
  };
});

router.post('/userCreate', async (req, res) => {
  const existingUser = await User.find( { 'user': req.body.user } );
  
  if(existingUser.length >=1) {
    return res.redirect('/login');
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const post = new User({
    user: req.body.user,
    password: hashedPassword,
    email: req.body.email
  });
    const savePost = await post.save();
    res.redirect('/');
  } catch(err) {
    res.json( { message: err });
  };
});

router.post('/userAuth', async (req, res) => {
  const userName = await User.find( { 'user': req.body.user } );

  if(userName.length <= 0) {
    return res.redirect('/login');
  } else {
    const match = await bcrypt.compare(req.body.password, userName[0].password);

    if(match) {
      req.session.userID = userName[0]._id;
      req.session.user = userName[0].user;
      req.session.isLoggedIn = true;
      req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
    } else {
      console.log('failed');
    }

  }
  profileUser = req.session.userID;
  req.session.save();
  res.redirect(`/`);
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
    const updatedPost = await Post.updateOne({_id: req.params.postId }, { $set: {title: req.body.title, body: req.body.body}});
    res.json(updatedPost);
  } catch(err) {
    res.json( { message: err });
  }
});

module.exports = router;