//var tutorList = document.getElementById("tutor-list-container");
var reviewTemp = 
'<div id="tutor-list-container" class="container-6 _2 w-container">' +
      '<div class="w-row">' +
        '<div class="w-col w-col-3"><img src="{photo_link}" height="303" sizes="(max-width: 767px) 96vw, (max-width: 991px) 167px, 220px" alt="" class="image-5"></div>' +
        '<div class="w-col w-col-6">' +
          '<h1 class="heading-4 list">{full_name}<br></h1>' +
          '<div class="text-block-12 list">{education}</div>' +
          '<div class="text-block-3 list">{description}</div>' +
          '<h5 class="heading-28">{subjects}</h5>' +
        '</div>' +
        '<div class="column-3 w-col w-col-3">' +
          '<div class="text-block-7 list">{price}/ORĂ<br>‍</div>' +
          '<div class="text-block-8 list"><br><span class="text-span-7">{hours_taught}</span> <span class="text-span-8">de ore predate</span><br></div><img src="images/4stars.png" width="114" srcset="images/4stars-p-500.png 500w, images/4stars-p-800.png 800w, images/4stars.png 900w" sizes="114px" alt="" class="image-13 list">' +
          '<div class="text-block-18 list">{reviews} review-uri</div><a href="tutor-profile.html" class="button-6 w-button">Vezi profilul! </a>' +
        '</div>' +
      '</div>' +
    '</div>';

function fillTutorProfile(data) {
  // Get HTML fields
  var fullNameText = document.getElementById("tutor-full-name");
  var educationText = document.getElementById("tutor-education");
  var descriptionText = document.getElementById("tutor-description");
  var profileImg = document.getElementById("tutor-photo");
  var aboutMeText = document.getElementById("tutor-about-me");
  var aboutSessionsText = document.getElementById("tutor-about-sessions");
  var priceText = document.getElementById("tutor-price");
  var sessionHoursField = document.getElementById("tutor-session-hours");
  var ratingStarsImg = document.getElementById("tutor-rating-stars");
  var ratingCountText = document.getElementById("tutor-rating-count");
  var reviewsList = document.getElementById("tutor-reviews-list");

  // Fill the fields
  console.log(data);
  fullNameText.innerHTML = data.name + " " + data.surname;
  var education = JSON.parse(data.education);
  educationText.innerHTML = education.place;
  descriptionText.innerHTML = data.description;
  profileImg.src = data.photo_link;
  aboutMeText.innerHTML = data.about_me;
  aboutSessionsText.innerHTML = data.about_sessions;
  priceText.innerHTML = data.price + " RON/ORĂ";
}

function sendTutorProfileRequest(username) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      fillTutorProfile(JSON.parse(this.responseText));
    }
  };
  const ENDPOINT = "http://gv281.user.srcf.net:8080/api/tutors/" + username;
  req.open("GET", ENDPOINT, true);
  req.send();
}

function refresh() {
  let params = new URLSearchParams(location.search);
  let username = params.get('username');
  sendTutorProfileRequest(username);
}

// Main
refresh();
