let send_message_button = document.getElementById('send-message-button');
let new_session_modal = document.getElementById('new-session-modal');
let free_session = document.getElementById("freesession-2");
let paid_session = document.getElementById("1hmeditation-2");
let subject = document.getElementById("subject-2");
let level = document.getElementById("level");
let start_date = document.getElementById("start_date");
let start_time = document.getElementById("start_time");
let send_message_field = document.getElementById('send-message-field');
let send_message_form = document.getElementById('send-message-form');
let new_session_button = document.getElementById('new-session-button');
let messages_container = document.getElementById('messages-container');
let send_booking_button = document.getElementById("send-booking-button");
let response_div = document.getElementById("response_div");

let otherMessageTemp = '<div><div class="text-block-31 _2">{message}</div></div>';
let ownMessageTemp = '<div class="div-block-9"><div class="text-block-33">{message}</div></div>';

let messages_list_page = '/';
let other_username = '';
let other_user_full_name = document.getElementById('other-user-name');

function scrollToBottom() {
  messages_container.scrollTop = messages_container.scrollHeight;
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == new_session_modal) {
    new_session_modal.style.display = "none";
  }
}

// Search if a user with this username exists,
// and if not redirect to messages list
function searchUser(username) {
  // TODO: Escape strings
  const ENDPOINT = API_ENDPOINT + "/users/" + username;
  getData(ENDPOINT)
    .then(user => {
      // If no tutor is found, redirect to main page
      if (!user) { location.href = messages_list_page; }
      // Else fill in the user's name
      else {
        other_user_full_name.innerHTML =
          user.surname + " " + user.name;
        sendTutorSubjectsRequest(username);
      }
      // TODO: Refactor the flow of this page
    })
}

let tutor_subjects_levels = [];

function getTutorSubjects() {
  subjectCodes = []
  subjects = []
  for (const sl of tutor_subjects_levels) {
    if (subjectCodes.includes(sl.subject.subject_code)) continue
    subjectCodes.push(sl.subject.subject_code)
    subjects.push(sl.subject)
  }
  return subjects
}

function getTutorLevels(sub_code) {
  return tutor_subjects_levels
    .filter(sl => sl.subject.subject_code == sub_code)
    .map(sl => sl.level)
}

function fillSubjectsList() {
  let subjectsList = document.getElementById('subject-2');
  let opt0 = '<option value="">Selectează materia</option>';
  let opt = '<option value="{subject_code}">{subject_name}</option>';
  subjectsList.innerHTML = opt0;
  getTutorSubjects().forEach(s => {
    subjectsList.appendChild(makeItem(opt, s));
  });

  // Add on change listener
  subjectsList.onchange = (evt) => {
    console.log("Subject changed: " + evt.target.value);
    fillLevelsList(evt.target.value);
  };
}

function fillLevelsList(sub_code) {
  let levelsList = document.getElementById('level');
  let opt0 = '<option value="">Selectează nivelul</option>';
  let opt = '<option value="{level_code}">{level_name}</option>';
  levelsList.innerHTML = opt0;

  // If no subject selected, show no levels
  if (!sub_code) return;

  getTutorLevels(sub_code).forEach(l => {
    levelsList.appendChild(makeItem(opt, l));
  });
}

async function sendTutorSubjectsRequest(username) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      user.getIdToken(true)
        .then(async idToken => {
          let userProfile = await getData(API_ENDPOINT + "/users/me", idToken)
          let isTutor = userProfile.roles.includes("tutor");
          console.log("Is tutor: " + JSON.stringify(isTutor));
          let tutorUsername = username
          if (isTutor) {
            console.log("Username: " + JSON.stringify(userProfile.username));
            tutorUsername = userProfile.username
          }

          const ENDPOINT = API_ENDPOINT + `/tutors/${tutorUsername}`;
          getData(ENDPOINT)
            .then(response => {
              tutor_subjects_levels = response.subjects
              fillSubjectsList();
              fillLevelsList();
            })
        })
        .catch(err => console.log(err))
    }
  });
}

function refreshMessageList() {
  firebase.auth().currentUser?.getIdToken(true)
    .then(idToken => {
      const ENDPOINT = API_ENDPOINT + "/messages";
      let query = `?recipient=${other_username}`;
      getData(ENDPOINT + query, idToken)
        .then(messages => {
          messages_container.innerHTML = "";
          console.log(messages);
          if ('err' in messages) {
            console.log(messages.err);
          } else {
            messages.forEach(m => {
              let temp = otherMessageTemp;
              if (other_username != m.sender_username) { temp = ownMessageTemp; }
              messages_container.appendChild(makeItem(temp, { message: m.content }));
            });
            scrollToBottom();
          }
        })
        .catch(err => console.log(err))
    })
    .catch(function (error) {
      // Handle error
      console.log("Failed to get user token: " + error.message);
    });
}

// Send a new session message / email
new_session_button.onclick = function () {
  new_session_modal.style.display = "block";
}

// Send message
send_message_button.onclick = sendMessage;
send_message_form.onsubmit = sendMessage;

function sendMessage() {
  // Retrieve message content
  let content = send_message_field.value;
  if (content == '') return;

  // Get user token
  firebase.auth().currentUser?.getIdToken(true)
    .then(idToken => {
      let json = {
        recipient: other_username,
        message_type: "text",
        message: content,
        email: 1
      };
      const ENDPOINT = API_ENDPOINT + "/messages";
      postData(ENDPOINT, idToken, json)
        .then(response => {
          console.log(response);
          send_message_field.value = '';
          refreshMessageList();
        })
    });
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    refreshMessageList();
  } else {
    // No user is signed in.
    location.href = '/';
  }
});

function sendTutorProfileRequest(username) {
  const ENDPOINT = API_ENDPOINT + "/tutors/" + username;
  getData(ENDPOINT).then(response => {
    fillTutorProfile(response);
  })
}

let params = new URLSearchParams(location.search);
other_username = params.get('u');
if (other_username === null) location.href = messages_list_page;
searchUser(other_username);

//Send Booking
send_booking_button.onclick = sendBooking;

function sendBooking() {
  console.log(subject.value);
  console.log(level.value);
  console.log(start_date.value);
  console.log(start_time.value);
  console.log(free_session.checked);
  console.log(paid_session.checked);
  var sessionType = -1;
  if (free_session.checked) {
    sessionType = 0;
  }
  if (paid_session.checked) {
    sessionType = 1;
  }
  // UTC +2
  // TODO: Adjust for winter/summer time zone
  let start_datetime = new Date(start_date.value + "T" + start_time.value + "+02:00");
  let start_datetime_string = start_datetime.toISOString();
  console.log(start_datetime_string);

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      user.getIdToken(true).then(idToken => {
        const ENDPOINT = API_ENDPOINT + "/users/me"
        getData(ENDPOINT, idToken).then(userProfile => {
          const isTutor = userProfile.roles.includes("tutor")
          const ownUsername = userProfile.username;
          console.log(isTutor);
          console.log(ownUsername);
          const ENDPOINT = API_ENDPOINT + "/bookings";
          var json = {};
          if (isTutor == 0) {
            json = { startTimestamp: start_datetime_string, subjectID: subject.value, levelID: level.value, sessionType, studentID: ownUsername, tutorID: other_username };
          }
          if (isTutor == 1) {
            json = { startTimestamp: start_datetime_string, subjectID: subject.value, levelID: level.value, sessionType, studentID: other_username, tutorID: ownUsername };
          }
          postData(ENDPOINT, idToken, json).then(response => {
            console.log(response);
            location.href = "programari.html";
            response_div.innerHTML = '<p> Sesiunea ta a fost programată. Intră pe pagina de Programări pentru a urmări toate programările tale.</p>';
          })
        })
      }).catch(err => {
        console.log("Error in retrieving user token: " + err.message);
      });
    } else {
      console.log("No user Signed In");
    }
  });
}
