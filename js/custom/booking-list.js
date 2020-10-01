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
  '<div class="w-col w-col-2 w-col-tiny-tiny-stack"><a href="{session_link}" class="button-5 w-button">Începe lecția</a></div>' +
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
  '<div class="text-block-25">{session_subject} - {session_subject}</div>' +
  '</div>' +
  '<div class="w-col w-col-1">' +
  '<div class="text-block-26 _2">În așteptarea plății</div>' +
  '</div>' +
  '<div class="column-8 w-col w-col-2"><a href="#" class="button-10 _2 _3 w-button">Plătește acum</a></div>' +
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
  '<div class="text-block-25">{session_subject} - {session_subject}</div>' +
  '</div>' +
  '<div class="w-col w-col-1"></div>' +
  '<div class="w-col w-col-2">' +
  '<div class="text-block-26">Sesiune confirmată</div>' +
  '</div>' +
  '</div>' +
'</div>';

let bookingTemp_awaitingConfirmation=
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
  '<div class="text-block-26 _3">Așteptare confirmare</div>' +
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
  '<div class="w-col w-col-1"><a href="#" class="button-10 _2 w-button">Refuză</a></div>' +
  '<div class="column-8 w-col w-col-2"><a href="#" class="button-10 w-button">Acceptă</a></div>' +
  '</div>' +
'</div>';



function makeListItem(itemData) {
  let map = {};
  let weekday = new Array(7);
  weekday[0] = "Duminică";
  weekday[1] = "Luni";
  weekday[2] = "Marți";
  weekday[3] = "Miercuri";
  weekday[4] = "Joi";
  weekday[5] = "Vineri";
  weekday[6] = "Sâmbătă";
  let start_date = new Date(itemData.start_timestamp);
  map.session_dayOfWeek = weekday[start_date.getDay()];
  map.session_day = start_date.getDate();
  let months = new Array(12);
  months[0]="Ianuarie";
  months[1]="Februarie";
  months[2]="Martie";
  months[3]="Aprilie";
  months[4]="Mai";
  months[5]="Iunie";
  months[6]="Iulie";
  months[7]="August";
  months[8]="Septembrie";
  months[9]="Octombrie";
  months[10]="Noiembrie";
  months[11]="Decembrie";
  map.session_month = months[start_date.getMonth()];
  map.session_hour = start_date.getHours();
  map.session_minute = start_date.getMinutes();
  let types = new Array(2);
  types[0]="Întâlnire Gratuită (15 minute)";
  types[1]="Meditație Plătită (O oră)";
  map.session_type = types[itemData.session_type];
  if (itemData.username==itemData.student_id)
    map.session_nameOther = itemData.tutor_name;
  else if (itemData.username==itemData.tutor_id)
    map.session_nameOther = itemData.student_name;
  map.session_subject = itemData.subject_name;
  map.session_level = itemData.level_name;
  let status = itemData.status_id;
  let student_id = itemData.student_id;
  let tutor_id = itemData.tutor_id;
  let username = itemData.username;
  if ((status == 0 && username == student_id) || (status==1 && username==tutor_id))
  return makeItem(bookingTemp_awaitingConfirmation, map);
  else if ((status == 0 && username == tutor_id) || (status == 1 && username == student_id))
  return makeItem(bookingTemp_acceptRefuse, map);
  else if (status == 2 && username == tutor_id)
  return makeItem(bookingTemp_awaitingPayment, map);
  else if (status == 2 && username == student_id)
  return makeItem(bookingTemp_lessonToPay, map);
  else if (status == 3)
  return makeItem(bookingTemp_lessonPaid, map);
  else if (status == 4)
  return makeItem(bookingTemp_enterLesson, map);
  else
  console.log("Error while retrieving booking status");
}
  


function sendBookingsRequest() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      user.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        // send token to backend
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            fillBookingList(this.responseText);
          }
        };
        console.log(idToken);
        const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/bookings/read/?token=" + idToken;
        req.open("GET", ENDPOINT, true);
        req.send();
      }).catch(function (error) {
        // Handle error
        console.log("Error in retrieving user token: " + error.message);
      });
    } else {
      // No user is signed in.
    }
  });
  var user = firebase.auth().currentUser;
}

function fillBookingList(data) {
  bookingList.innerHTML = "";
  JSON.parse(data).forEach(function (itemData) {
    let item = makeListItem(itemData);
    bookingList.appendChild(item);
  });
}

sendBookingsRequest();