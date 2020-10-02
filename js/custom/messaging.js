let send_message_button = document.getElementById('send-message-button');
let send_message_field = document.getElementById('send-message-field');
let new_session_button = document.getElementById('new-session-button');
let messages_container = document.getElementById('messages-container');

let otherMessageTemp = '<div><div class="text-block-31 _2">{message}</div></div>';
let ownMessageTemp = '<div class="div-block-9"><div class="text-block-33">{message}</div></div>';

let messages_list_page = '/';
let other_username = '';

function scrollToBottom() {
  messages_container.scrollTop = messages_container.scrollHeight;
}

// Search if a user with this username exists,
// and if not redirect to messages list
function searchUser(username) {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let users = JSON.parse(this.responseText);
      // If no tutor is found, redirect to main page
      if (users.length == 0) { location.href = messages_list_page; }
      // Else do nothing and stay on the page
      // TODO: Refactor the flow of this page
    }
  };
  // TODO: Escape strings
  const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/users/" + username;
  req.open("GET", ENDPOINT, true);
  req.send();
}

function refreshMessageList() {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      messages_container.innerHTML = "";
      console.log(this.responseText);
      let messages = JSON.parse(this.responseText);
      if ('err' in messages) {
        console.log(messages.err);
      } else {
        messages.forEach(m => {
          let temp = otherMessageTemp;
          if (m.username == m.sender_id) { temp = ownMessageTemp; }
          messages_container.appendChild(makeItem(temp, {message: m.content}));
        });
        scrollToBottom();
      }
    }
  };
  firebase.auth().currentUser?.getIdToken(true)
    .then(token => {
      const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/messages";
      let query = "/?token=" + token + "&other_username=" + other_username;
      req.open("GET", ENDPOINT + query, true);
      req.send();
    }).catch(function(error) {
      // Handle error
      console.log("Failed to get user token: " + error.message);
    });
}

// Send a new session message / email
new_session_button.onclick = function () {
}

// Send message
send_message_button.onclick = function () {
  // Retrieve message content
  let content = send_message_field.value;

  // Make XMLHttpRequest to post new message
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      refreshMessageList();
    }
  };
  // Get user token
  firebase.auth().currentUser?.getIdToken(true)
    .then(token => {
      let json = {
        token: token,
        recipient: other_username,
        message_type: "text",
        message: content
      };
      const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/messages";
      req.open("POST", ENDPOINT, true);
      req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      req.send(JSON.stringify(json));
    });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    refreshMessageList();
  } else {
    // No user is signed in.
  }
});

let params = new URLSearchParams(location.search);
other_username = params.get('u');
if (other_username === undefined) location.href = messages_list_page;
searchUser(other_username);
