let reviewList = document.getElementById("tutor-reviews-list");

let reviewTemp =
'<div>' +
  '<div class="text-block-15">{reviewer}</div><img src="{rating_image}" width="68" sizes="68px" alt="" class="image-11">' +
  '<div class="text-block-17">{comment}</div>' +
  '<div class="text-block-16">{date}</div>' +
'</div>';

let username = null;

let messageForm = document.getElementById("message-form");
let messageBox = messageForm["message"];
let messageSubject = messageForm["Subject"];

function splitParagraphs(text) {
  let pars = text.split('\n');
  let ans = '';
  pars.forEach(p => {
    if (p == '') return;
    ans += '<p>' + p + '</p>';
  });
  return ans;
}

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
  fullNameText.innerHTML = data.name + " " + data.surname;
  var education = JSON.parse(data.education);
  educationText.innerHTML = education.place;
  descriptionText.innerHTML = data.description;
  profileImg.src = data.photo_link;
  aboutMeText.innerHTML = splitParagraphs(data.about_me);
  aboutSessionsText.innerHTML = splitParagraphs(data.about_sessions);
  priceText.innerHTML = data.price + " RON/ORĂ";

  // Make a request for tutor subjects
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Fill subject list
      let res = JSON.parse(this.responseText);
      let opt0 = '<option value="">Selectează materia și nivelul</option>';
      messageSubject.innerHTML = opt0;
      let opt = '<option value="{value}">{subject_name} - {level_name}</option>';
      res.forEach(value => {
        let tempData = {
          value: "" + value.subject_code + "," + value.level_code, 
          subject_name: value.subject_name, 
          level_name: value.level_name
        };
        messageSubject.appendChild(makeItem(opt, tempData)); 
      });
    }
  };
  const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/tutors/" + data.username + "/subjects?showLevels=1";
  req.open("GET", ENDPOINT, true);
  req.send();
}

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

function sendMessage() {
  // Message form submitted
  let user = firebase.auth().currentUser;
  if (user) {
    // User already logged in; send request
    window.location.href = "/mesagerie.html?u="+username;
  } else {
    // Add cookie and redirect to login page
    setCookie("tutor-message", JSON.stringify({'tutor': username, 'content': messageBox.value, 'subject': messageSubject.value}));
  }
}

function sendTutorReviewsRequest(username) {
  var req = new XMLHttpRequest();
  reviewList.innerHTML = "";
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let reviews = JSON.parse(this.responseText);
      reviews.forEach(review => {
        let tempData = {
          reviewer: review.name + " " + review.surname,
          comment: review.comment,
          rating_image: getRatingImagePath(9),
          date: review.date.substr(0, 10)
        };
        reviewList.appendChild(makeItem(reviewTemp, tempData));
      });
    }
  };
  const ENDPOINT = API_ENDPOINT + "/reviews?tutor_username=" + username;
  req.open("GET", ENDPOINT, true);
  req.send();
}

function main() {
  let params = new URLSearchParams(location.search);
  username = params.get('username');
  sendTutorProfileRequest(username);
  sendTutorReviewsRequest(username);
}

// Main
main();
