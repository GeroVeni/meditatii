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

async function fillMessagesList(username, data) {
  messagesList.innerHTML = "";

  if (data.length == 0) {
    messagesList.appendChild(makeItem('<div class="w3-center" style="margin: 8px;">No messages found.</div>', {}));
    return
  }

  for (const convo of data) {
    console.log(convo.last_message.sent_date);
    const otherUsername = convo.participants.find(p => p != username)
    const otherUser = await getData(API_ENDPOINT + `/users/${otherUsername}`)
    let messageTempData = {
      message_link: "mesagerie.html?u=" + otherUsername,
      sender_name: `${otherUser.name} ${otherUser.surname}`,
      last_message: convo.last_message.content,
      date: new Date(convo.last_message.sent_date).toLocaleDateString(
        'ro-RO',
        {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })
    };
    messagesList.appendChild(makeItem(messageTemp, messageTempData));
  }
}

function sendMessagesRequest(user) {
  user.getIdToken(true)
    .then(async idToken => {
      const me = await getData(API_ENDPOINT + "/users/me", idToken)
      const convoList = await getData(API_ENDPOINT + "/convos", idToken)
      fillMessagesList(me.username, convoList)
    })
    .catch(err => { console.log(err) });
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    sendMessagesRequest(user);
  } else {
    // User not logged in redirect to main page
    location.href = '/';
  }
})
