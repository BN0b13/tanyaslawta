document.getElementById('loginSubmit').addEventListener('click', () => {
  const loginUser = document.getElementById('loginUser').value;
  const loginPassword = document.getElementById('loginPassword').value;
  const loginTitle = document.getElementById('loginTitle');
  
  if(loginUser.length <= 0) {
    return message('Please Enter A User Name');
  } else if(loginPassword.length <= 0) {
    return message('Please Enter A Password');
  } else {
    console.log('Login Clicked')
    fetch('/test/login', 
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( {
          'user': loginUser,
          'password': loginPassword   
        })
      }) 
      .then(response=> {
        if(response.status == 200) {
          console.log('sucess');
          location.href = '/';
        } else if(response.status == 404) {
          message('User Name Does Not Exist');
        } else {
          message('Password Incorrect');
        }
      })
      .catch(err=> console.log('ERROR: ', err))
  }
})

function message(msg) {
  loginTitle.textContent = msg;
  setTimeout(() => {
    loginTitle.textContent = 'Please Sign In';
  }, 5000);
}

