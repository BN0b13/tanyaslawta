document.addEventListener('DOMContentLoaded', loadBlogs);
const postTitle = document.getElementById('title');
const postDes = document.getElementById('description');
const submitBtn = document.getElementById('submitBtn');
const blogArr = document.getElementById('currentBlogs');
const editBtnArea = document.getElementById('editBtnArea');


async function loadBlogs() {
  const results = await fetch('/blogs/api')
  .then(response=> response.json())
  .then(data=> {
    let output = '';

    data.reverse().forEach((post) => {
      output += `
        <div class="container">
          <div class="card">
            <div class="card-body" id="${post._id}">
              <div class="d-flex justify-content-end">
                <div class="dropdown">
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Edit and Delete</button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><button class="editBtn btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#newBlogPost">New Edit</button></li>
                    <li><button type="button" class="deleteBtn btn btn-danger btn-sm">Delete</button></li>
                  </ul>
                </div>
              </div>
              <h2 class="card-title">${post.title}</h2>
              <p class="card-text">${post.description}</p>
              <p class="card-text">${new Date(post.date).toDateString()}</p>
            </div>
          </div>
        </div>
      `;
    });
    
    blogArr.innerHTML = output;
    listenClick();
  })
  .catch(err=> console.log(err));
  postTitle.value = '';
  postDes.value = '';
  submitBtn.style.display = 'block';
}


function listenClick() {
  document.getElementById('currentBlogs').addEventListener('click', (e) => {
    
    const targ = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id;
    
    console.log(targ);
      if(e.target.className == 'deleteBtn btn btn-danger btn-sm') {
        fetch(`/${targ}`, {
          method: 'DELETE'
        }).then(response=> response.json())
        .then(console.log(`Deleted ${targ}`));

        loadBlogs();
      } else if(e.target.className == 'editBtn btn btn-secondary btn-sm') {
        const titleContent = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].textContent;
        const bodyContent = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].textContent;
        postTitle.value = titleContent;
        postDes.value = bodyContent;
        // submitBtn.textContent = 'Edit Post';
        // submitBtn.type = 'button';
        // submitBtn.id = 'submitEdit';

        submitBtn.style.display = 'none';
        editBtnArea.innerHTML = '<button type="button" id="submitEdit" class="btn btn-primary m-2" data-bs-dismiss="modal">Edit Post</button>';

        document.getElementById('submitEdit').addEventListener('click', function() {
          const title = postTitle.value;
          const description = postDes.value;
          const data = { title, description};

          fetch(`/${targ}`, {
          method: 'PATCH',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(data)
          
        }).then(response=> response.json())
        .then(loadBlogs())
        });
      } else { return }

    e.preventDefault();
  });
}