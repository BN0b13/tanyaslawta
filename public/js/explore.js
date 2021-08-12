document.addEventListener('DOMContentLoaded', loadUp);
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

function loadUp() {
  loadAllPosts();
}