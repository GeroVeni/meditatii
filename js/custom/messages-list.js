let messagesList = document.getElementById('messages-list');

let messageTemp = 
'<a href="{message_link}" class="div-block-7 w-inline-block">' + 
  '<div class="columns-3 w-row">' + 
    '<div class="w-col w-col-10">' + 
      '<h5 class="heading-43">{sender_name}</h5>' +
      '<div class="text-block-23 _2">{last_message}</div>' +
    '</div>' +
    '<div class="column-6 w-col w-col-2">' +
      '<div class="text-block-24 _2">{date}</div>' +
    '</div>' +
  '</div>' +
'</a>';

function fillMessagesList(data) {
  messagesList.innerHTML = "";
  
  data.forEach(convo => {
    let messageTempData = {
      message_link: "mesagerie.html?u=" + convo.other.username,
      sender_name: convo.other.surname + ' ' + convo.other.name,
      last_message: convo.last_msg_content,
      date: new Date(convo.last_msg_date).toLocaleDateString(
        'ro-RO',
        {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }
        )
    };
    messagesList.appendChild(makeItem(messageTemp, messageTempData));
  });
}

function sendMessagesRequest(user) {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(this.responseText);
      fillMessagesList(data);
    }
  };
  const ENDPOINT = API_ENDPOINT + "/messages";
  user.getIdToken(true)
  .then(idToken => {
    let query = "?token=" + idToken;
    req.open("GET", ENDPOINT + query, true);
    req.send();
  });
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    sendMessagesRequest(user);
  } else {
    // User not logged in redirect to main page
    location.href = '/';
  }
})
