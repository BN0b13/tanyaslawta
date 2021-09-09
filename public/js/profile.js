document.addEventListener('DOMContentLoaded', loadUp);
const newPostNav = document.getElementById('newPostNav');
const myPostsNav = document.getElementById('myPostsNav');
const myCommentsNav = document.getElementById('myCommentsNav');
const settingsNav = document.getElementById('settingsNav');
const currentProfileView = document.getElementById('currentProfileView');
const postTitle = document.getElementById('title');
const postBody = document.getElementById('body');
const modalBtnArea = document.getElementById('modalBtnArea');
const editBtnArea = document.getElementById('editBtnArea');
const closeModal = document.getElementById('closeModal');
const logOutBtn = document.getElementById('logOutBtn');
const deleteBtn = document.getElementsByClassName('deleteBtn');
let curUser = '';

const navArr = [['myPostsNav', true], ['myCommentsNav', false], ['settingsNav', false]];

// Nav Event Listeners
navListener = (nav) => {
  for(i=0; i< navArr.length; i++) {
    if(navArr[i][0] == `${nav}`) {
      navArr[i][1] = true;
      console.log('True hit' + navArr[i][1])
    } else {
      navArr[i][1] = false;
      console.log('False Hit' + navArr[i][1])
    }
  }
  // console.log(navArr);
  navMenu();
}

myPostsNav.addEventListener('click', () => { navListener(navArr[0][0]) });
myCommentsNav.addEventListener('click', () => { navListener(navArr[1][0]) });
settingsNav.addEventListener('click', () => { navListener(navArr[2][0]) });


deletePost = (postidentification) => {
    fetch(`/${postidentification}`, {
    method: 'DELETE'
  }).then(response=> response.json())
  .then(data => {
    console.log(data);
    loadMyPosts();
  });
}

editPost = async  (postidentification) => {
  const post = await fetch(`/posts/${postidentification}`)
  .then(response=> response.json())
  .then(data=> {
    postTitle.value = data[0].title;
    postBody.value = data[0].body;
    modalBtnArea.innerHTML = `
      <button onClick="clearFields()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
      <button onClick="submitEdit('${data[0]._id}')" type="button" class="btn btn-primary m-2" data-bs-dismiss="modal">Edit Post</button>
    `;})
  .catch(err=> console.log(err));
}

submitEdit = (data) => {
  console.log(data);
  fetch(`/${data}`, {
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
  .then((data) => loadMyPosts());
}

clearFields = () => {
  postTitle.value = '';
  postBody.value = '';
  modalBtnArea.innerHTML = `
    <button onClick="clearFields()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    <button type="submit" id="submitBtn" class="btn btn-primary m-2">Submit</button>
  `;
}

navMenu = () => {
  navArr.forEach(nav => {
    if(nav[1]) {
      loadView(nav[0]);
    }
  })
}

loadView = (nav) => {
    if(nav == 'myPostsNav') {
      loadMyPosts();
    }
    if(nav == 'myCommentsNav') {
      loadMyComments();
    }
    if(nav == 'settingsNav') {
      return console.log('Settings Hit');
    }
}

loadMyPosts = () => {
  const results = fetch('/profile/posts/api')
  .then(response=> response.json())
  .then(data=> {
    let pageContent = '';
    data.reverse().forEach((post) => {
      pageContent += `
        <div class="container">
          <div class="card">
            <div class="card-body" id="${post._id}">
              <div class="d-flex justify-content-end">
                <div class="dropdown">
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Manage</button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><button onClick="editPost('${post._id}')" class="editBtn btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#newBlogPost">Edit</button></li>
                    <li><button onClick="deletePost('${post._id}')" type="button" class="deleteBtn btn btn-danger btn-sm">Delete</button></li>
                  </ul>
                </div>
              </div>
              <h2 class="card-title">${post.title}</h2>
              <p class="card-text">${post.body}</p>
              <p class="card-text">${new Date(post.date).toDateString()}</p>
            </div>
          </div>
        </div>
      `;
      currentProfileView.innerHTML = pageContent;
      console.log(data);
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
    data.forEach((comment) => {
        pageContent += `
        <div class="container m-1">
          <div class="card">
            <div class="card-body" id="${comment._id}">
              <div class="d-flex justify-content-between">
                <div>${comment.user}</div>
                <div>${new Date(comment.date).toDateString()}</div>
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

function loadUp() {
  clearFields()
  loadUser();
  navMenu();
}