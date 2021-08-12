document.getElementById('commentSubmit').addEventListener('click', async () => {
  const comment = document.getElementById('commentContent').value;
  const accordianBtnText = document.getElementById('commentAccordianBtn');
  const postIDArr = window.location.pathname.split('/');
  const postID = postIDArr[2];

  if(comment.length <= 0) {
    accordianBtnText.textContent = 'Please Write A Comment Before Submitting';
    setTimeout(() => {
      accordianBtnText.textContent = 'Leave A Comment';
    }, 5000);
    return;
  }
  fetch('/comment-post', 
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( {
        'comment': comment,
        'postID': postID   
      })
    })
    location.reload();
})

