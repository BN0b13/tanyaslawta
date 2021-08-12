const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
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

router.get('/logout', async (req, res) => {
  await User.updateOne({_id: req.session.userID }, { $set: {isLoggedIn: false}});
  req.session.destroy((err) => {err});
  res.redirect(`/login`);
});

router.get('/explore', seshCheck, (req, res) => {
  const explorePage = (path.join(process.cwd(), '/public/html/explore.html'));
  res.sendFile(explorePage);
});

router.get('/content/:postId', seshCheck, async (req, res) => {
  const contentPage = (path.join(process.cwd(), '/public/html/content.html'));
  res.sendFile(contentPage);
});

router.get('/profile/api', (req, res) => {
  Post.find( {userID: req.session.userID} )
  .then(result=> {
    res.send(result);
  })
  .catch(error=> {
    res.send(error);
  });
});

router.get('/profile-user/api', (req, res) => {
  User.find( { _id: req.session.userID } )
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

router.get('/posts/:postId', (req, res) => {
  Post.find( { _id: req.params.postId } )
  .then(result=> {
    res.send(result);
  })
  .catch(error=> {
    res.send(error);
  });
});

router.get('/comments/:postId', (req, res) => {
  Comment.find( { postID: req.params.postId } )
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
  const duplicatePostChecker = await Post.find( { title: title, body: body } );

  if(duplicatePostChecker.length >= 1) {
    return res.redirect('/');
  }

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
  // res.sendStatus(400);
});

router.post('/comment-post', (req, res) => {

  // console.log(req.session);

  // destructuring - setting the const to null to sanatize in case req.body doesnt attach it
  const { comment = null, postID = null } = req.body;
  const userID = req.session.userID;
  const user = req.session.user;

  const post = new Comment({
    userID: userID,
    user: user,
    comment: comment,
    postID: postID
  });
  try {
    post.save();
    res.redirect(`/content/${postID}`);
  } catch(err) {
    res.send('There was an error' + err);
  };
});

router.post('/userCreate', async (req, res) => {
  const existingUser = await User.find( { user: req.body.user } );
  
  if(existingUser.length >=1) {
    return res.redirect('/login');
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const post = new User({
    user: req.body.user,
    password: hashedPassword,
    email: req.body.email,
    isAdmin: false,
    isLoggedIn: true
  });
    const savePost = await post.save();
    const userName = await User.find( { user: req.body.user } );
    await User.updateOne({_id: userName[0]._id }, { $set: {isLoggedIn: true}});
    req.session.userID = userName[0]._id;
    req.session.user = userName[0].user;
    req.session.isLoggedIn = true;
    req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
    res.redirect('/');
  } catch(err) {
    res.json( { message: err });
  };
});

router.post('/userAuth', async (req, res) => {
  const userName = await User.find( { 'user': req.body.user } );

  if(userName.length <= 0) {
    // user does not exist
    return res.redirect('/login');
  } else if(userName[0].isLoggedIn) {
    //user already signed in elsewhere
    return res.redirect('/login');
  } else {
    const match = await bcrypt.compare(req.body.password, userName[0].password);

    if(match) {
      await User.updateOne({_id: userName[0]._id }, { $set: {isLoggedIn: true}});
      req.session.userID = userName[0]._id;
      req.session.user = userName[0].user;
      req.session.isLoggedIn = true;
      req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
    } else {
      return res.redirect('/login');
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