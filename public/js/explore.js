document.addEventListener('DOMContentLoaded', loadUp);
const postTitle = document.getElementById('title');
const postBody = document.getElementById('body');
const submitBtn = document.getElementById('submitBtn');
const blogArr = document.getElementById('currentBlogs');
const editBtnArea = document.getElementById('editBtnArea');
const logOutBtn = document.getElementById('logOutBtn');

// load post previews
function loadAllPosts() {
  const results = fetch('/posts/api')
  .then(response=> response.json())
  .then(data=> {
    let output = '';

    data.reverse().forEach((post) => {
      output += `
          <div class="container m-2 p-2">
            <div class="card">
              <div class="card-body">
                <h2 class="card-title">${post.title}</h2>
                <div>
                  <div class="d-flex justify-content-center">${post.user}</div>
                  <div class="d-flex justify-content-center">${new Date(post.date).toDateString()}</div>
                </div>
                <a id="${post._id}" class="btn btn-primary" href="/content/${post._id}" role="button">Read Post</a>
              </div>
            </div>
          </div>
      `;
    });
    
    blogArr.innerHTML = output;
  })
  .catch(err=> console.log(err));
}

function loadContent() {
  const postID = window.location.pathname;
  const results = fetch('/posts/api')
  .then(response=> response.json())
  .then(data=> {
    let pageContent = '';
    data.forEach((post) => {
      if(postID.includes(post._id)) {
        pageContent = `
        <div class="container">
          <div class="card">
            <div class="card-body" id="${post._id}">
              <div class="d-flex justify-content-between">
                <div>${post.user}</div>
                <div>${new Date(post.date).toDateString()}</div>
              </div>
            </div>
              <h2 class="card-title">${post.title}</h2>
              <p class="card-text">${post.body}</p>
              <p class="card-text"></p>
            </div>
          </div>
        </div>
      `;
      document.getElementById('pageContent').innerHTML = pageContent;
      }
    })
  })
  .catch(err=> console.log(err));
}

function checkUserStatus() {
  const userRes = fetch('/profile-user/api')
  .then(response=> response.json())
  .then(data=> {
    console.log('checkUserStatus hit')
    if(data.length >= 1) {
      logOutBtn.innerHTML = '<a class="nav-link" href="/logout">Log Out</a>';
    }
  })
  .catch(err=> console.log(err));
  
}

function loadUp() {
  checkUserStatus();
  loadAllPosts();
  loadContent();
}