document.addEventListener('DOMContentLoaded', loadUp);
const postTitle = document.getElementById('title');
const postBody = document.getElementById('body');
const submitBtn = document.getElementById('submitBtn');
const profileContent = document.getElementById('profileContent');
const editBtnArea = document.getElementById('editBtnArea');
const logOutBtn = document.getElementById('logOutBtn');

function profileControlls() {
  profileContent.addEventListener('click', (e) => {
    
    const targ = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id;
    
    console.log(targ);
      if(e.target.className == 'deleteBtn btn btn-danger btn-sm') {
        fetch(`/${targ}`, {
          method: 'DELETE'
        }).then(response=> response.json())
        .then(console.log(`Deleted ${targ}`));
        loadContent();
      } else if(e.target.className == 'editBtn btn btn-secondary btn-sm') {
        const titleContent = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].textContent;
        const bodyContent = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].textContent;
        postTitle.value = titleContent;
        postBody.value = bodyContent;
        // submitBtn.textContent = 'Edit Post';
        // submitBtn.type = 'button';
        // submitBtn.id = 'submitEdit';
  
        submitBtn.style.display = 'none';
        editBtnArea.innerHTML = '<button type="button" id="submitEdit" class="btn btn-primary m-2" data-bs-dismiss="modal">Edit Post</button>';
  
        document.getElementById('submitEdit').addEventListener('click', function() {
          const title = postTitle.value;
          const body = postBody.value;
          const data = { title, body};
  
          fetch(`/${targ}`, {
          method: 'PATCH',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(data)
          
        }).then(response=> response.json())
        .then(clearFields())
        });
      } else { return }
  
    e.preventDefault();
  });
}

function clearFields() {
  postTitle.value = '';
  postBody.value = '';
  submitBtn.style.display = 'block';
}

async function loadContent() {
  const results = await fetch('/profile/api')
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
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Edit and Delete</button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><button class="editBtn btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#newBlogPost">New Edit</button></li>
                    <li><button type="button" class="deleteBtn btn btn-danger btn-sm">Delete</button></li>
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
      profileContent.innerHTML = pageContent;
    })
  })
  .catch(err=> console.log(err));
}

async function loadUser() {
  const results = await fetch('/profile-user/api')
  .then(response=> response.json())
  .then(data=> {
    let output = '';
    data.forEach(user => {
      output += `
        <div>Welcome ${user.user}</div>
      `
    })
    document.getElementById('profileHead').innerHTML = output; 
  })
  .catch(err=> console.log(err));  
}

function loadUp() {
  loadUser();
  loadContent();
  profileControlls();
}