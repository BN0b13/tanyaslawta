document.addEventListener('DOMContentLoaded', loadUp);
const postTitle = document.getElementById('title');
const postBody = document.getElementById('body');
const modalBtnArea = document.getElementById('modalBtnArea');
const profileContent = document.getElementById('profileContent');
const editBtnArea = document.getElementById('editBtnArea');
const logOutBtn = document.getElementById('logOutBtn');
const deleteBtn = document.getElementsByClassName('deleteBtn');

// function profileControlls() {
//   profileContent.addEventListener('click', (e) => {    
//     const targ = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id;

//       if(e.target.className == 'deleteBtn btn btn-danger btn-sm') {
//         fetch(`/${targ}`, {
//           method: 'DELETE'
//         }).then(response=> response.json())
//         .then(data => {
//           return loadUp();
//         });
//       } else if(e.target.className == 'editBtn btn btn-secondary btn-sm') {
//         const titleContent = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].textContent;
//         const bodyContent = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].textContent;
//         postTitle.value = titleContent;
//         postBody.value = bodyContent;
//         modalBtnArea.innerHTML = '<button type="button" id="postCancelBtn" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button type="button" id="submitEdit" class="btn btn-primary m-2" data-bs-dismiss="modal">Edit Post</button>';
//         document.getElementById('postCancelBtn').addEventListener('click', () => {
//           clearFields();
//         })
//         document.getElementById('submitEdit').addEventListener('click', function() {
//           const title = postTitle.value;
//           const body = postBody.value;
//           const data = { title, body};
  
//           fetch(`/${targ}`, {
//           method: 'PATCH',
//           headers: {
//             'Content-type': 'application/json'
//           },
//           body: JSON.stringify(data)
          
//         }).then(response=> response.json())
//         .then(data => {
//           return loadContent();
//         })
//         });
//       } else { return }

//     e.preventDefault();
//   });
// }

deletePost = (postidentification) => {
    fetch(`/${postidentification}`, {
    method: 'DELETE'
  }).then(response=> response.json())
  .then(data => {
    console.log(data);
    loadContent();
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
  .then((data) => {console.log(data);});
  loadContent();
}

// .click((e) => {
//   console.log('hit');
//   console.log(e);
// })

function clearFields() {
  postTitle.value = '';
  postBody.value = '';
  modalBtnArea.innerHTML = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    <button type="submit" id="submitBtn" class="btn btn-primary m-2">Submit</button>
  `;
}

function loadContent() {
  const results = fetch('/profile/api')
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
      profileContent.innerHTML = pageContent;
    })
  })
  .catch(err=> console.log(err));
}

function loadUser() {
  const results = fetch('/profile-user/api')
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
  clearFields()
  loadUser();
  loadContent();
  // profileControlls();
}