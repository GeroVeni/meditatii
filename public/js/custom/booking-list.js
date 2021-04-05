
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
  '<div class="text-block-25">{session_subject} - {session_subject}</div>' +
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

function updateBooking(booking_id, requested_status){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      user.getIdToken(true).then(function (idToken) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200) {
            console.log("Update Successfull");
            location.reload();
          }
        };
        const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/bookings/update";
        req.open("POST",ENDPOINT,true);
        req.setRequestHeader("Content-type", "application/json");
        req.send(JSON.stringify({"token": idToken, "requested_status": requested_status, "booking_id": booking_id}));
      }).catch(function (error){
        console.log("Error in retrieving user token: " + error.message);
      });
    } else {
      console.log("No user Signed In");
    }
  });
}



function buttonsInit(){
  var acceptButtons = document.getElementsByClassName("accept");
  var refuseButtons = document.getElementsByClassName("refuse");
  var enterLesson = document.getElementsByClassName("enter_lesson");
  var payButtons = document.getElementsByClassName("pay");
  for (var i=0; i < acceptButtons.length; i++) {
    acceptButtons.item(i).onclick = function(){
      updateBooking(this.name, 2);
    }
  };
    for (var i=0; i < payButtons.length; i++) {
      payButtons.item(i).onclick = function(){
        window.location.replace("https://meditatiipenet.ro/informatiifacturare.html?b="+this.name);
      }
  };
  for (var i=0; i < refuseButtons.length; i++) {
    refuseButtons.item(i).onclick = function(){
      updateBooking(this.name, 6);
    }
  };
  for (var i=0; i < enterLesson.length; i++){
    enterLesson.item(i).onclick = function(){
      let booking_id = this.name;
      sessionStorage.setItem("booking_id",booking_id);
      firebase.auth().onAuthStateChanged(function(user){
        if(user){
          user.getIdToken(true).then(function(idToken){
            var req = new XMLHttpRequest();
            req.onreadystatechange = function(){
              if(this.readyState == 4 && this.status == 200){
                var data = JSON.parse(this.responseText);
                sessionStorage.setItem('end_timestamp', data[0].end_timestamp);
                sessionStorage.setItem("start_timestamp", data[0].start_timestamp);
                sessionStorage.setItem("authorised_users", data[0].student_name+","+data[0].tutor_name);
                sessionStorage.setItem("username",data[0].student_name);
                window.location.replace("https://meditatiipenet.ro/lectie.html");
              }
            };
            const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/bookings/read?token=" + idToken + "&booking_id=" + booking_id;
            req.open("GET", ENDPOINT, true);
            req.send();
          }).catch(function(error){
            console.log("Error in retrieving user token: " + error.message);
          });
        } else {
          //No user signed in
        }
      });
    }
  }
}

function makeListItem(itemData) {
  let map = {};
  const weekday = [
    "Duminică", "Luni", "Marți", "Miercuri",
    "Joi", "Vineri", "Sâmbătă"
  ];
  let start_date = new Date(itemData.start_timestamp);
  // Add 3 hours from UTC time to get Romania time
  // TODO: Adjust for winter time zone
  start_date.setHours(start_date.getUTCHours() + 3);
  // Add 10 mins to display original starting time
  start_date.setMinutes(start_date.getMinutes() + 10);
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
  else if (status > 4)
  console.log("Session is in the past")
}
  


function sendBookingsRequest() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      user.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        // send token to backend
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            fillBookingList(bookingList, this.responseText, buttonsInit);
          }
        };
        const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/bookings/read?token=" + idToken;
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

function fillBookingList(HTMLelem, data, callback) {
  HTMLelem.innerHTML = "";
  JSON.parse(data).forEach(function (itemData) {
    let item = makeListItem(itemData);
    if(item){
    HTMLelem.appendChild(item);
    }
  });
  callback();
}


function updateAllBookings() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      user.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        // send token to backend
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            sendBookingsRequest();
          }
        };
        const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/bookings/general_update";
        req.open("POST", ENDPOINT, true);
        req.setRequestHeader("Content-type", "application/json");
        req.send(JSON.stringify({"token": idToken}));
      }).catch(function (error) {
        // Handle error
        console.log("Error in retrieving user token: " + error.message);
      });
    } else {
      // No user is signed in.
    }
  });
}

updateAllBookings();