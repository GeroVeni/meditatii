
let bookingList = document.getElementById("booking-container");

let bookingTemp_enterLesson =
  '<div class="div-block-7">' +
  '<div class="columns-3 w-row">' +
  '<div class="w-col w-col-4 w-col-tiny-tiny-stack">' +
  '<h5>{session_dayOfWeek}, {session_day} {session_month}, {session_hour}:{session_minute}</h5>' +
  '<div class="text-block-23">{session_type}</div>' +
  '</div>' +
  '<div class="column-6 w-col w-col-2 w-col-tiny-tiny-stack">' +
  '<div class="text-block-24">{session_nameOther}</div>' +
  '</div>' +
  '<div class="w-col w-col-3 w-col-tiny-tiny-stack">' +
  '<div class="text-block-25">{session_subject} - {session_level}</div>' +
  '</div>' +
  '<div class="w-col w-col-1 w-col-tiny-tiny-stack"></div>' +
  '<div class="w-col w-col-2 w-col-tiny-tiny-stack"><a href="#" name="{booking_id}" class="enter_lesson button-5 w-button">Începe lecția</a></div>' +
  '</div>' +
  '</div>';

let bookingTemp_lessonToPay =
  '<div class="div-block-7">' +
  '<div class="columns-4 w-row">' +
  '<div class="w-col w-col-4">' +
  '<h5>{session_dayOfWeek}, {session_day} {session_month}, {session_hour}:{session_minute}</h5>' +
  '<div class="text-block-23">{session_type}</div>' +
  '</div>' +
  '<div class="w-col w-col-2">' +
  '<div class="text-block-24">{session_nameOther}</div>' +
  '</div>' +
  '<div class="w-col w-col-3">' +
  '<div class="text-block-25">{session_subject} - {session_level}</div>' +
  '</div>' +
  '<div class="w-col w-col-1">' +
  '<div class="text-block-26 _2">În așteptarea plății</div>' +
  '</div>' +
  '<div class="column-8 w-col w-col-2"><a name="{booking_id}" href="#" class="pay button-10 _2 _3 w-button">Plătește acum</a></div>' +
  '</div>' +
  '</div>' +
  '</div>';

let bookingTemp_lessonPaid =
  '<div class="div-block-7">' +
  '<div class="columns-4 w-row">' +
  '<div class="w-col w-col-4">' +
  '<h5>{session_dayOfWeek}, {session_day} {session_month}, {session_hour}:{session_minute}</h5>' +
  '<div class="text-block-23">{session_type}</div>' +
  '</div>' +
  '<div class="w-col w-col-2">' +
  '<div class="text-block-24">{session_nameOther}</div>' +
  '</div>' +
  '<div class="w-col w-col-3">' +
  '<div class="text-block-25">{session_subject} - {session_level}</div>' +
  '</div>' +
  '<div class="w-col w-col-1"></div>' +
  '<div class="w-col w-col-2">' +
  '<div class="text-block-26">Sesiune confirmată</div>' +
  '</div>' +
  '</div>' +
  '</div>';

let bookingTemp_awaitingConfirmation =
  '<div class="div-block-7">' +
  '<div class="columns-4 w-row">' +
  '<div class="w-col w-col-4">' +
  '<h5>{session_dayOfWeek}, {session_day} {session_month}, {session_hour}:{session_minute}</h5>' +
  '<div class="text-block-23">{session_type}</div>' +
  '</div>' +
  '<div class="w-col w-col-2">' +
  '<div class="text-block-24">{session_nameOther}</div>' +
  '</div>' +
  '<div class="w-col w-col-3">' +
  '<div class="text-block-25">{session_subject} - {session_level}</div>' +
  '</div>' +
  '<div class="w-col w-col-1"></div>' +
  '<div class="w-col w-col-2">' +
  '<div class="text-block-26 _3">Așteptare confirmare</div>' +
  '</div>' +
  '</div>' +
  '</div>';


let bookingTemp_awaitingPayment =
  '<div class="div-block-7">' +
  '<div class="columns-4 w-row">' +
  '<div class="w-col w-col-4">' +
  '<h5>{session_dayOfWeek}, {session_day} {session_month}, {session_hour}:{session_minute}</h5>' +
  '<div class="text-block-23">{session_type}</div>' +
  '</div>' +
  '<div class="w-col w-col-2">' +
  '<div class="text-block-24">{session_nameOther}</div>' +
  '</div>' +
  '<div class="w-col w-col-3">' +
  '<div class="text-block-25">{session_subject} - {session_level}</div>' +
  '</div>' +
  '<div class="w-col w-col-1"></div>' +
  '<div class="w-col w-col-2">' +
  '<div class="text-block-26 _2">În așteptarea plății</div>' +
  '</div>' +
  '</div>' +
  '</div>';

let bookingTemp_acceptRefuse =
  '<div class="div-block-7">' +
  '<div class="columns-4 w-row">' +
  '<div class="w-col w-col-4">' +
  '<h5>{session_dayOfWeek}, {session_day} {session_month}, {session_hour}:{session_minute}</h5>' +
  '<div class="text-block-23">{session_type}</div>' +
  '</div>' +
  '<div class="w-col w-col-2">' +
  '<div class="text-block-24">{session_nameOther}</div>' +
  '</div>' +
  '<div class="w-col w-col-3">' +
  '<div class="text-block-25">{session_subject} - {session_level}</div>' +
  '</div>' +
  '<div class="w-col w-col-1"><a name="{booking_id}" href="#" class="refuse button-10 _2 w-button">Refuză</a></div>' +
  '<div class="column-8 w-col w-col-2"><a name="{booking_id}" href="#" class="accept button-10 w-button">Acceptă</a></div>' +
  '</div>' +
  '</div>';

function updateBooking(booking_id, verb) {
  if (verb != 'accept' && verb != 'reject') return
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      user.getIdToken(true).then(function (idToken) {
        const ENDPOINT = API_ENDPOINT + `/bookings/${booking_id}/${verb}`;
        postData(ENDPOINT, idToken)
          .then(() => {
            console.log("Update Successfull");
            location.reload();
          })
      }).catch(function (error) {
        console.log("Error in retrieving user token: " + error.message);
      });
    } else {
      console.log("No user Signed In");
    }
  });
}

function acceptBooking(booking_id) {
  return updateBooking(booking_id, 'accept')
}

function rejectBooking(booking_id) {
  return updateBooking(booking_id, 'reject')
}

function buttonsInit() {
  var acceptButtons = document.getElementsByClassName("accept");
  var refuseButtons = document.getElementsByClassName("refuse");
  var enterLesson = document.getElementsByClassName("enter_lesson");
  var payButtons = document.getElementsByClassName("pay");
  for (var i = 0; i < acceptButtons.length; i++) {
    acceptButtons.item(i).onclick = function () {
      acceptBooking(this.name)
    }
  };
  for (var i = 0; i < payButtons.length; i++) {
    payButtons.item(i).onclick = function () {
      window.location.href = '/informatiifacturare.html?b=' + this.name
    }
  };
  for (var i = 0; i < refuseButtons.length; i++) {
    refuseButtons.item(i).onclick = function () {
      rejectBooking(this.name)
    }
  };
  for (var i = 0; i < enterLesson.length; i++) {
    enterLesson.item(i).onclick = function () {
      let booking_id = this.name;
      sessionStorage.setItem("booking_id", booking_id);
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          user.getIdToken(true)
            .then(idToken => {
              const ENDPOINT = API_ENDPOINT + `/bookings/${booking_id}`;
              getData(ENDPOINT, idToken)
                .then(async data => {
                  const tutor = getData(API_ENDPOINT + `/users/${data.tutor_username}`)
                  const student = getData(API_ENDPOINT + `/users/${data.student_username}`)
                  sessionStorage.setItem('end_timestamp', data.end_timestamp);
                  sessionStorage.setItem("start_timestamp", data.start_timestamp);
                  sessionStorage.setItem("authorised_users", student.name + "," + tutor.name);
                  sessionStorage.setItem("username", student.name);
                  window.location.href = "https://meditatiipenet.ro/lectie.html"
                })
            })
            .catch(err => {
              console.log("Error in retrieving user token: " + err.message);
            });
        } else {
          //No user signed in
        }
      });
    }
  }
}

function getFullName(profile) {
  return `${profile.name} ${profile.surname}`
}

async function makeListItem(username, itemData) {
  let map = {};
  const weekday = [
    "Duminică", "Luni", "Marți", "Miercuri",
    "Joi", "Vineri", "Sâmbătă"
  ];
  console.log(username)
  console.log(itemData)
  let start_date = new Date(itemData.start_timestamp);
  // Add 2 hours from UTC time to get Romania time
  // TODO: Adjust for winter/summer time zone
  start_date.setHours(start_date.getUTCHours() + 2);
  // Fill in template values
  map.booking_id = itemData.booking_id;
  map.session_dayOfWeek = weekday[start_date.getDay()];
  map.session_day = start_date.getDate();
  const months = [
    "Ianuarie", "Februarie", "Martie",
    "Aprilie", "Mai", "Iunie", "Iulie",
    "August", "Septembrie", "Octombrie",
    "Noiembrie", "Decembrie"
  ];
  map.session_month = months[start_date.getMonth()];
  map.session_hour = start_date.getHours();
  if (map.session_hour < 10) map.session_hour = '0' + map.session_hour;
  map.session_minute = start_date.getMinutes();
  if (map.session_minute < 10) map.session_minute = '0' + map.session_minute;
  let types = new Array(2);
  types[0] = "Întâlnire Gratuită (15 minute)";
  types[1] = "Meditație Plătită (O oră)";
  map.session_type = types[itemData.session_type];

  const tutorProfile = await getData(API_ENDPOINT + `/users/${itemData.tutor_username}`)
  const studentProfile = await getData(API_ENDPOINT + `/users/${itemData.student_username}`)
  if (username == itemData.student_username)
    map.session_nameOther = getFullName(tutorProfile);
  else if (username == itemData.tutor_username)
    map.session_nameOther = getFullName(studentProfile);
  map.session_subject = itemData.subject.subject.subject_name;
  map.session_level = itemData.subject.level.level_name;
  let status = itemData.status_id;
  let student_username = itemData.student_username;
  let tutor_username = itemData.tutor_username;
  console.log(map)
  if ((status == 0 && username == student_username) || (status == 1 && username == tutor_username))
    return makeItem(bookingTemp_awaitingConfirmation, map);
  else if ((status == 0 && username == tutor_username) || (status == 1 && username == student_username))
    return makeItem(bookingTemp_acceptRefuse, map);
  else if (status == 2 && username == tutor_username)
    return makeItem(bookingTemp_awaitingPayment, map);
  else if (status == 2 && username == student_username)
    return makeItem(bookingTemp_lessonToPay, map);
  else if (status == 3)
    return makeItem(bookingTemp_lessonPaid, map);
  else if (status == 4)
    return makeItem(bookingTemp_enterLesson, map);
  else if (status > 4)
    console.log("Session is in the past")
}

function sendBookingsRequest() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      user.getIdToken(/* forceRefresh */ true)
        .then(async idToken => {
          const ENDPOINT = API_ENDPOINT + "/bookings"
          const me = await getData(API_ENDPOINT + "/users/me", idToken)
          getData(ENDPOINT, idToken)
            .then(response => {
              console.log(response)
              return fillBookingList(bookingList, me.username, response, buttonsInit);
            })
        })
        .catch(err => {
          // Handle error
          console.log("Error in retrieving user token: " + err.message);
        });
    } else {
      // No user is signed in.
    }
  });
}

async function fillBookingList(HTMLelem, username, data, callback) {
  HTMLelem.innerHTML = "";
  for (const itemData of data) {
    let item = await makeListItem(username, itemData);
    if (item) {
      HTMLelem.appendChild(item);
    }
  }
  callback();
}

sendBookingsRequest();