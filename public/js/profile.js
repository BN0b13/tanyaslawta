document.addEventListener('DOMContentLoaded', loadUp);
const newPostNav = document.getElementById('newPostNav');
const myPostsNav = document.getElementById('myPostsNav');
const myCommentsNav = document.getElementById('myCommentsNav');
const settingsNav = document.getElementById('settingsNav');
const currentProfileView = document.getElementById('currentProfileView');
const myForm = document.getElementById('myForm');
const postTitle = document.getElementById('title');
const postBody = document.getElementById('body');
const modalTitle = document.getElementById('modalTitle');
const modalPostTitleDiv = document.getElementById('modalPostTitleDiv');
const modalMsg = document.getElementById('modalMsg');
const modalBody = document.getElementById('modalBody');
const newPostBodyLabel = document.getElementById('newPostBodyLabel');
const modalBtnArea = document.getElementById('modalBtnArea');
const editBtnArea = document.getElementById('editBtnArea');
const closeModal = document.getElementById('closeModal');
const logOutBtn = document.getElementById('logOutBtn');
const deleteBtn = document.getElementsByClassName('deleteBtn');
let curUser = '';

const navArr = [[myPostsNav, true], [myCommentsNav, false], [settingsNav, false]];

// Nav Event Listeners
myPostsNav.addEventListener('click', () => { navListener(navArr[0][0]) });
myCommentsNav.addEventListener('click', () => { navListener(navArr[1][0]) });
settingsNav.addEventListener('click', () => { navListener(navArr[2][0]) });

navListener = (nav) => {
  for(i=0; i< navArr.length; i++) {
    if(navArr[i][0] == nav) {
      navArr[i][1] = true;
    } else {
      navArr[i][1] = false;
    }
  }
  navMenu();
}

navMenu = () => {
  navArr.forEach(nav => {
    if(nav[1]) {
      nav[0].style.backgroundColor = '#f4f4f4';
      loadView(nav[0]);
    } else {
      nav[0].style.backgroundColor = '#fff';
    }
  })
}

loadView = (nav) => {
    if(nav == myPostsNav) {
      loadMyPosts();
    }
    if(nav == myCommentsNav) {
      loadMyComments();
    }
    if(nav == settingsNav) {
      console.log('MAKE THE SETTINGS PAGE ALREADY, JEEZ!');
    }
}

loadMyPosts = () => {
  const results = fetch('/profile/posts/api')
  .then(response=> response.json())
  .then(data=> {
    let pageContent = '';
    data.reverse().forEach((post) => {
      pageContent += `
        <div class="container my-2">
          <div class="card">
            <div class="card-body" id="${post._id}">
              <div class="d-flex justify-content-between">
                <p class="card-text">${new Date(post.date).toDateString()}</p>
                <div class="dropdown">
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"></button>
                  <ul class="dropdown-menu text-center profileManageDropDown" aria-labelledby="dropdownMenuButton1">
                    <a href="/content/${post._id}" class="h6"><li class="bottomBorder py-2">Go To Post</li></a>
                    <a onClick="editPost('${post._id}')" class="h6" data-bs-toggle="modal" data-bs-target="#newBlogPost"><li class="bottomBorder py-2">Edit Post</li></a>
                    <a onClick="deleteConfirm('${post._id}')" class="h6" data-bs-toggle="modal" data-bs-target="#newBlogPost"><li class="py-2">Delete Post</li></a>
                  </ul>
                </div>
              </div>
              <h2 class="card-title">${post.title}</h2>
              <p class="card-text">${post.body}</p>
            </div>
          </div>
        </div>
      `;
      currentProfileView.innerHTML = pageContent;
    })
  })
  .catch(err=> console.log(err));
}

loadMyComments = () => {
  const postIDArr = window.location.pathname.split('/');
  const postID = postIDArr[2];
  const results = fetch(`/profile/comments/api`)
  .then(response=> response.json())
  .then(data=> {
    let pageContent = '';
    data.reverse().forEach((comment) => {
        pageContent += `
        <div class="container my-2">
          <div class="card">
            <div class="card-body" id="${comment._id}">
              <div class="d-flex justify-content-between">
                <p>${new Date(comment.date).toDateString()}</p>
                <div class="dropdown">
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"></button>
                  <ul class="dropdown-menu text-center profileManageDropDown" aria-labelledby="dropdownMenuButton1">
                    <a href="/content/${comment.postID}" class="h6"><li class="bottomBorder py-2">Go To Post</li></a>
                    <a onClick="editComment('${comment._id}')" class="h6" data-bs-toggle="modal" data-bs-target="#newBlogPost"><li class="bottomBorder py-2">Edit Comment</li></a>
                    <a onClick="deleteCommentConfirm('${comment._id}')" class="h6" data-bs-toggle="modal" data-bs-target="#newBlogPost"><li class="py-2">Delete Comment</li></a>
                  </ul>
                </div>
              </div>
            </div>
              <p class="card-text">${comment.comment}</p>
            </div>
          </div>
        </div>
      `;
    })
    currentProfileView.innerHTML = pageContent;
  })
  .catch(err=> console.log(err));
}

loadUser = () => {
  const results = fetch('/profile/user/api')
  .then(response=> response.json())
  .then(data=> {
    let output = '';
    data.forEach(user => {
      curUser = user._id;
      output = `
        <div class="h5 text-center p-1">Welcome ${user.user}</div>
      `
    })
    document.getElementById('profileHead').innerHTML = output;
  })
  .catch(err=> console.log(err));  
}

// Post Utilities

deleteConfirm = (post) => {
  modalTitle.innerHTML = 'Delete Post';
  myForm.style.display = 'none';
  modalMsg.innerHTML = `<p>Are you sure you want to delete your post?</p>
  <div id="modalBtnArea" class="d-flex justify-content-center">
    <button onClick="clearFields()" type="button" class="btn btn-secondary m-2" data-bs-dismiss="modal">Cancel</button>
    <button onClick="deletePost('${post}')" type="button" class="btn btn-danger m-2" data-bs-dismiss="modal">Delete Post</button>
  </div>`;
  // modalBtnArea.innerHTML = `
  //   <button onClick="clearFields()" type="button" class="btn btn-secondary m-2" data-bs-dismiss="modal">Cancel</button>
  //   <button onClick="deletePost('${post}')" type="button" class="btn btn-danger m-2" data-bs-dismiss="modal">Delete Post</button>
  // `;
}

deletePost = (postidentification) => {
  fetch(`/delete-post/${postidentification}`, {
    method: 'DELETE'
  }).then(response=> response.json())
  .then(data => {
    clearFields();
    loadMyPosts();
  });
}

editPost = async  (postidentification) => {
  modalTitle.innerHTML = 'Edit Post';
  const post = await fetch(`/posts/${postidentification}`)
  .then(response=> response.json())
  .then(data=> {
    postTitle.value = data[0].title;
    postBody.value = data[0].body;
    modalBtnArea.innerHTML = `
        <button onClick="clearFields()" type="button" class="btn btn-secondary m-2" data-bs-dismiss="modal">Cancel</button>
        <button onClick="submitEdit('${data[0]._id}')" type="button" class="btn btn-primary m-2" data-bs-dismiss="modal">Edit Post</button>
    `;})
  .catch(err=> console.log(err));
}

submitEdit = (data) => {
console.log(data);
fetch(`/edit-post/${data}`, {
  method: 'PATCH',
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
   },
  body: JSON.stringify( {
    'title': postTitle.value,
    'body': postBody.value   
  })})
.then((response) => response.json())
.then((data) => {
  clearFields();
  loadMyPosts();
});
}

// Comment Utilities

deleteCommentConfirm = (comment) => {
  modalTitle.innerHTML = 'Delete Comment';
  myForm.style.display = 'none';
  modalMsg.innerHTML = `<p>Are you sure you want to delete your comment?</p>`;
  modalBtnArea.innerHTML = `
    <button onClick="clearFields()" type="button" class="btn btn-secondary m-2" data-bs-dismiss="modal">Cancel</button>
    <button onClick="deleteComments('${comment}')" type="button" class="btn btn-danger m-2" data-bs-dismiss="modal">Delete Comment</button>
  `;
}

deleteComments = (commentidentification) => {
  fetch(`/delete-comment/${commentidentification}`, {
    method: 'DELETE'
  }).then(response=> response.json())
  .then(data => {
    clearFields();
    loadMyComments();
  });
}

editComment = async  (commentidentification) => {
  modalTitle.innerHTML = 'Edit Comment';
  const post = await fetch(`/profile/comment/${commentidentification}`)
  .then(response=> response.json())
  .then(data=> {
    modalPostTitleDiv.style.display = 'none';
    newPostBodyLabel.innerHTML = 'Comment';
    postBody.value = data[0].comment;
    modalBtnArea.innerHTML = `
        <button onClick="clearFields()" type="button" class="btn btn-secondary m-2" data-bs-dismiss="modal">Cancel</button>
        <button onClick="submitCommentEdit('${data[0]._id}')" type="button" class="btn btn-primary m-2" data-bs-dismiss="modal">Edit Post</button>
    `;})
  .catch(err=> console.log(err));
}

submitCommentEdit = (data) => {
fetch(`/edit-comment/${data}`, {
  method: 'PATCH',
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
   },
  body: JSON.stringify( {
    'comment': postBody.value   
  })})
.then((response) => response.json())
.then((data) => {
  clearFields();
  loadMyComments();
});
}

clearFields = () => {
  modalTitle.innerHTML = 'New Post';
  modalMsg.innerHTML = '';
  modalPostTitleDiv.style.display = 'block';
  myForm.style.display = 'block';
  postTitle.value = '';
  postBody.value = '';
  newPostBodyLabel.innerHTML = 'Body';
  modalBtnArea.innerHTML = `
    <button onClick="clearFields()" type="button" class="btn btn-secondary m-2" data-bs-dismiss="modal">Cancel</button>
    <button type="submit" id="submitBtn" class="btn btn-primary m-2">Submit</button>
  `;
}

function loadUp() {
  clearFields()
  loadUser();
  navMenu();
}