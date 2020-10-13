let send_message_button = document.getElementById('send-message-button');
let free_session = document.getElementById("freesession-2");
let paid_session = document.getElementById("1hmeditation-2");
let subject = document.getElementById("subject-2");
let level = document.getElementById("level");
let start_date = document.getElementById("start_date");
let start_time = document.getElementById("start_time");
let send_message_field  = document.getElementById('send-message-field');
let send_message_form   = document.getElementById('send-message-form');
let new_session_button  = document.getElementById('new-session-button');
let messages_container  = document.getElementById('messages-container');
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

// Search if a user with this username exists,
// and if not redirect to messages list
function searchUser(username) {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let users = JSON.parse(this.responseText);
      // If no tutor is found, redirect to main page
      if (users.length == 0) { location.href = messages_list_page; }
      // Else fill in the user's name
      else {
        other_user_full_name.innerHTML =
          users[0].name + " " + users[0].surname;
        sendTutorSubjectsRequest(username);
      }
      // TODO: Refactor the flow of this page
    }
  };
  // TODO: Escape strings
  const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/users/" + username;
  req.open("GET", ENDPOINT, true);
  req.send();
}

let tutor_subjects_levels = [];

function arrayUnique(arr) {
  return arr.filter((v, i, a) => (i == 0 || a[i-1].subject_code != a[i].subject_code));
}

function getTutorSubjects() {
  return arrayUnique(tutor_subjects_levels.map(sl => {
    return {subject_code: sl.subject_code, subject_name: sl.subject_name}
  }));
}

function getTutorLevels(sub_code) {
  return tutor_subjects_levels.filter(v => v.subject_code == sub_code);
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

function sendTutorSubjectsRequest(username) {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      tutor_subjects_levels = JSON.parse(this.responseText);
      fillSubjectsList();
      fillLevelsList();
    }
  };
  const ENDPOINT = API_ENDPOINT + "/tutors/" + username + "/subjects?showLevels=1";
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
      let query = "?token=" + token + "&other_username=" + other_username;
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
send_message_button.onclick = sendMessage;
send_message_form.onsubmit = sendMessage;

function sendMessage() {
  // Retrieve message content
  let content = send_message_field.value;
  if (content == '') return;

  // Make XMLHttpRequest to post new message
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      send_message_field.value = '';
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
        message: content,
        email: 1
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

function sendTutorProfileRequest(username) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      fillTutorProfile(JSON.parse(this.responseText));
    }
  };
  const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/tutors/" + username;
  req.open("GET", ENDPOINT, true);
  req.send();
}

let params = new URLSearchParams(location.search);
other_username = params.get('u');
if (other_username === null) location.href = messages_list_page;
searchUser(other_username);

//Send Booking
send_booking_button.onclick = sendBooking;

function sendBooking(){
  console.log(subject.value);
  console.log(level.value);
  console.log(start_date.value);
  console.log(start_time.value);
  console.log(free_session.checked);
  console.log(paid_session.checked);
  var session_type = -1;
  if (free_session.checked){
    session_type = 0;
  }
  if (paid_session.checked){
    session_type = 1;
  }
  let start_datetime = start_date.value + "T" + start_time.value + ":00.000Z";
  console.log(start_datetime);

  firebase.auth().onAuthStateChanged(function (user){
    if (user){
      user.getIdToken(true).then(function (idToken){
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200){
            let isTutor = this.responseText;
            console.log(isTutor);
            req = new XMLHttpRequest();
            req.onreadystatechange = function(){
              if(this.readyState == 4 && this.status == 200){
                let own_username=JSON.parse(this.responseText)[0].username;
                console.log(own_username);
                req.onreadystatechange = function(){
                  if(this.readyState == 4 && this.status == 200){
                    console.log(this.responseText);
                    response_div.innerHTML = '<p> Sesiunea ta a fost programată. Intră pe pagina de Programări pentru a urmări toate programările tale.</p>'
                  }
                };
                const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/bookings/write";
                req.open("POST", ENDPOINT, true);
                req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                var json = {};
                if (isTutor == 0){
                  json = {token:idToken, status_id:0,start_timestamp:start_datetime,subject_id:subject.value,level_id:level.value,session_type:session_type,student_id:own_username,tutor_id:other_username};
                }
                if (isTutor == 1){
                  json = {token:idToken, status_id:1,start_timestamp:start_datetime,subject_id:subject.value,level_id:level.value,session_type:session_type,student_id:other_username,tutor_id:own_username};
                }
                req.send(JSON.stringify(json));
              }
            };
            const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/username/uid?token=" + idToken;
            req.open("GET",ENDPOINT,true);
            req.send();
          }
        };
        const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/tutor/type?token=" + idToken;
        req.open("GET",ENDPOINT,true);
        req.send();
      }).catch(function (error){
        console.log("Error in retrieving user token: " + error.message);
      });
    } else {
      console.log("No user Signed In");
    }
  });
}
