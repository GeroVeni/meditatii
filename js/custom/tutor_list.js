let tutorList = document.getElementById("tutor-list-container");
let tutorTemp = 
'<div id="tutor-list-container" class="container-6 _2 w-container">' +
  '<div class="w-row">' +
  '<div class="w-col w-col-3"><img src="{photo_link}" height="303" sizes="(max-width: 767px) 96vw, (max-width: 991px) 167px, 220px" alt="" class="image-5"></div>' +
  '<div class="w-col w-col-6">' +
  '<h1 class="heading-4 list">{full_name}<br></h1>' +
  '<div class="text-block-12 list">{education}</div>' +
  '<div class="text-block-3 list">{description}</div>' +
  '<h5 id={subjects_id} class="heading-28">{subjects}</h5>' +
  '</div>' +
  '<div class="column-3 w-col w-col-3">' +
  '<div class="text-block-7 list">{price}/ORĂ<br>‍</div>' +
  '<div class="text-block-8 list"><br><span class="text-span-7">{hours_taught}</span> <span class="text-span-8">de ore predate</span><br></div><img src="images/5-star-rating.png" width="114" sizes="114px" alt="" class="image-13 list">' +
  '<div class="text-block-18 list">{reviews} review-uri</div><a href="profilul-mentorului.html?username={username}" class="button-6 w-button">Vezi profilul! </a>' +
  '</div>' +
  '</div>' +
'</div>';

let filterItemTemp = 
'<a href="#" onclick="select_subject(\'{subject_code}\')" class="dropdown-link-2 w-dropdown-link">{subject_name}</a>';
let levelFilterItemTemp = 
'<a href="#" onclick="select_level(\'{level_code}\')" class="dropdown-link-2 w-dropdown-link">{level_name}</a>';

// Filter options
let filter_subject = "null";
let filter_level = "null";
let filter_price = "null";

// Search dropdowns
let selectedSubjectText = document.getElementById("subject-selected-text");
let subjectDropdownList = document.getElementById("subject-dropdown-list");
let selectedLevelText = document.getElementById("level-selected-text");
let levelDropdownList = document.getElementById("level-dropdown-list");

// Subject and level lists
let subjectList = [];
let levelList = [];

function makeListItem(itemData) {
  let map = {};
  map.full_name = itemData.name + " " + itemData.surname;
  map.description = itemData.description;
  map.photo_link = itemData.photo_link;
  map.hours_taught = "0";
  map.reviews = "1";
  map.price = itemData.price;
  let education = JSON.parse(itemData.education);
  map.education = education.place;
  map.subjects_id = "subjects-" + itemData.username;
  map.subjects = "";
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let res = JSON.parse(this.responseText);
      let slice = false;
      let txt = '';
      let username = '';
      res.forEach(value => {
        if (slice) { txt += ' / '; }
        else { slice = true; }
        txt += value.subject_name;
        username = value.tutor_username;
      });
      let subjectField = document.getElementById("subjects-" + username);
      subjectField.innerHTML = txt;
    }
  };
  const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/subjects";
  let query = "?tutor={username}";
  query = query.replace("{username}", itemData.username);
  req.open("GET", ENDPOINT + query, true);
  req.send();
  map.username = itemData.username;

  return makeItem(tutorTemp, map);
}

function getLevels(subject_code) {
  let subject = subjectList.find(s => s.subject_code == subject_code);
  if (subject === undefined) return [];
  return levelList.filter(l => l.level_group == subject.level_group);
}

function fillTutorList(data) {
  tutorList.innerHTML = "";
  data.forEach(function (itemData) {
    let item = makeListItem(itemData);
    tutorList.appendChild(item);
  });
}

function sendTutorListRequest() {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      fillTutorList(JSON.parse(this.responseText));
    }
  };
  const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/tutors";
  let query = "?subject={subject}&level={level}&price={price}";
  query = query.replace("{subject}", filter_subject);
  query = query.replace("{level}", filter_level);
  query = query.replace("{price}", filter_price);
  req.open("GET", ENDPOINT + query, true);
  req.send();
}

function set_subject_filter(subject) {
  filter_subject = subject;
  let textValue = "Toate materiile";
  if (subject !== null) {
    let selectedItems = subjectList.filter(value => value.subject_code == subject);
    textValue = selectedItems[0].subject_name;
  }
  selectedSubjectText.innerHTML = textValue;
  subjectDropdownList.style.display = "none";
}

function set_level_filter(level) {
  filter_level = level;
  let textValue = "Toate nivelurile";
  if (level !== null) {
    let selectedItems = levelList.filter(value => value.level_code == level);
    textValue = selectedItems[0].level_name;
  }
  selectedLevelText.innerHTML = textValue;
  levelDropdownList.style.display = "none";
}

function set_price_filter(level) {}

function select_subject(subject, skipRequest) {
  // If subject is empty, show all subjects
  if (subject === undefined || subject === null) {
    subject = null;
  }
  if (subject == -1) subject = null;
  set_subject_filter(subject);
  select_level(null, true);
  if (skipRequest != true) { sendTutorListRequest(); }
  let levels = getLevels(subject);
  fillLevelFilter(levels);
}

function select_level(level, skipRequest) {
  // If level is empty, show all levels
  if (level === undefined || level === null) {
    level = null;
  }
  if (level == -1) level = null;
  set_level_filter(level);
  if (skipRequest != true) { sendTutorListRequest(); }
}

function select_price(price, skipRequest) {}

function subject_dropdown_toggle() { subjectDropdownList.style.display = ""; }
function level_dropdown_toggle() { levelDropdownList.style.display = ""; }

function fillSubjectFilter(data) {
  subjectDropdownList.innerHTML = ''; 
  subjectDropdownList.appendChild(makeItem(filterItemTemp, {subject_code: -1, subject_name: "Toate materiile"}));
  data.forEach(function (itemData) {
    subjectDropdownList.appendChild(makeItem(filterItemTemp, itemData));
  });
}

function fillLevelFilter(data) {
  levelDropdownList.innerHTML = ''; 
  levelDropdownList.appendChild(makeItem(levelFilterItemTemp, {level_code: -1, level_name: "Toate nivelurile"}));
  data.forEach(function (itemData) {
    levelDropdownList.appendChild(makeItem(levelFilterItemTemp, itemData));
  });
}

function sendSubjectsRequest() {
  // Retrieve subjects
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      subjectList = JSON.parse(this.responseText);
      fillSubjectFilter(subjectList);

      sendLevelsRequest();
    }
  };
  const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/subjects";
  req.open("GET", ENDPOINT, true);
  req.send();
}

function sendLevelsRequest() {
  // Retrieve levels
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      levelList = JSON.parse(this.responseText);

      // Get search parameters from URL
      let params = new URLSearchParams(location.search);
      select_subject(params.get("materie"), /*skipRequest=*/true);
      select_level(params.get("nivel"), /*skipRequest=*/true);
      select_price(params.get("pret"), /*skipRequest=*/true);

      sendTutorListRequest();
    }
  };
  const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/levels";
  req.open("GET", ENDPOINT, true);
  req.send();
}

// Make filter lists
sendSubjectsRequest();

