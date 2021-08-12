document.addEventListener('DOMContentLoaded', loadUp);

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
      }
      document.getElementById('pageContent').innerHTML = pageContent;
    })
  })
  .catch(err=> console.log(err));
}

function loadComments() {
  const postIDArr = window.location.pathname.split('/');
  const postID = postIDArr[2];
  const results = fetch(`/comments/${postID}`)
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
    document.getElementById('commentSection').innerHTML = pageContent;
  })
  .catch(err=> console.log(err));
}

function loadUp() {
  loadContent();
  loadComments();
}