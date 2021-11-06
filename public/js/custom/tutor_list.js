let tutorList = document.getElementById("tutor-list-container");
let tutorTemp =
  '<div class="container-6 w-container">' +
  '<div class="columns-13 w-row">' +
  '<div class="column-23 w-col w-col-3 w-col-tiny-tiny-stack"><img src="{photo_link}" height="303" sizes="(max-width: 479px) 96vw, (max-width: 767px) 97vw, (max-width: 991px) 22vw, 220px" alt="" class="image-5"></div>' +
  '<div class="w-col w-col-6 w-col-tiny-tiny-stack">' +
  '<h1 class="heading-4 list">{full_name}<br></h1>' +
  '<div class="text-block-12 list">{education}</div>' +
  '<div class="text-block-3 list">{description}</div>' +
  '<h5 id={subjects_id} class="heading-28">{subjects}</h5>' +
  '</div>' +
  '<div class="column-3 w-col w-col-3 w-col-tiny-tiny-stack">' +
  '<div class="text-block-7 list _25">GRATUIT<br><span class="text-span-27">după prima sesiune gratuită prețul este de <br></span><span class="text-span-28">{price} RON/oră</span></div>' +
  '<div class="text-block-8 list {hours_taught_hide_class}"><br><span class="text-span-7">{hours_taught}</span> <span class="text-span-8">de ore predate</span><br></div><img style="display:none" src="images/5-star-rating.png" width="114" sizes="114px" alt="" class="image-13 list">' +
  '<div style="display:none" class="text-block-18 list">{reviews} review-uri</div>' +
  '<a href="profilul-mentorului.html?username={username}" class="button-6 w-button">Vezi profilul! </a>' +
  '</div>' +
  '</div>' +
  '</div>'

let filterItemTemp =
  '<a href="#" onclick="select_subject(\'{subject_code}\')" class="dropdown-link-2 w-dropdown-link">{subject_name}</a>';
let levelFilterItemTemp =
  '<a href="#" onclick="select_level(\'{level_code}\')" class="dropdown-link-2 w-dropdown-link">{level_name}</a>';

// Filter options
let filter_subject = "";
let filter_level = "";
let filter_price = "";

// Search dropdowns
let selectedSubjectText = document.getElementById("subject-selected-text");
let subjectDropdownList = document.getElementById("subject-dropdown-list");
let selectedLevelText = document.getElementById("level-selected-text");
let levelDropdownList = document.getElementById("level-dropdown-list");

// Subject and level lists
let subjectList = [];
let levelList = [];

let signed_user = null;

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User signed in
    signed_user = user;
  } else {
    // User signed out
    signed_user = null;
  }
  // Make filter lists
  sendSubjectsRequest();
});

function makeListItem(itemData, offers) {
  let map = {};
  map.full_name = itemData.surname + " " + itemData.name;
  map.description = itemData.description;
  map.photo_link = itemData.photo_link;
  map.hours_taught = itemData.completed_sessions;
  map.hours_taught_hide_class = ''
  if (itemData.completed_sessions == 0) map.hours_taught_hide_class = 'w3-hide'
  map.reviews = "1";
  // Display possible offers in price field
  let basePrice = itemData.price;
  map.price = basePrice;
  // for (let i = 0; i < offers.length; i++) {
  //   let offer = offers[i].offer;
  //   if (offer.absolute_discount) {
  //     let newPrice = basePrice - offer.absolute_discount;
  //     map.price = `<s>${basePrice}</s> <span style="color: red;">${newPrice}</span>`;
  //   }
  // }
  map.education = itemData.education.place;
  map.subjects_id = "subjects-" + itemData.username;
  map.username = itemData.username;
  let slice = false;
  let subjectsText = '';

  // Find tutor subjects from list of subjects and levels
  subjects = []
  itemData.subjects.forEach(value => {
    const nextSubject = value.subject.subject_name
    if (subjects.includes(nextSubject)) return
    subjects.push(nextSubject)
    if (slice) { subjectsText += ' / '; }
    else { slice = true; }
    subjectsText += value.subject.subject_name;
  });
  map.subjects = subjectsText

  return makeItem(tutorTemp, map);
}

function getLevels(subject_code) {
  let subject = subjectList.find(s => s.subject_code == subject_code);
  if (subject === undefined) return [];
  return levelList.filter(l => l.level_group == subject.level_group);
}

function fillTutorList(data, offers) {
  tutorList.innerHTML = "";
  data.forEach(function (itemData) {
    if (itemData.visible == 0) { return; }
    let item = makeListItem(itemData, offers);
    tutorList.appendChild(item);
  });
}

function sendTutorListRequest() {
  const ENDPOINT = API_ENDPOINT + "/tutors";
  let query = `?subject=${filter_subject || ""}&level=${filter_level || ""}&price=${filter_price || ""}`;
  getData(ENDPOINT + query)
    .then(tutorsInfoList => {
      if (signed_user) {
        signed_user.getIdToken(true)
          .then(async function (idToken) {
            // const ENDPOINT = API_ENDPOINT + "/users/me/offers";
            // let offers = await getData(ENDPOINT, idToken);
            fillTutorList(tutorsInfoList, []);
          });
      } else {
        fillTutorList(tutorsInfoList, []);
      }
    })
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

function set_price_filter(level) { }

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

function select_price(price, skipRequest) { }

function subject_dropdown_toggle() { subjectDropdownList.style.display = ""; }
function level_dropdown_toggle() { levelDropdownList.style.display = ""; }

function fillSubjectFilter(data) {
  subjectDropdownList.innerHTML = '';
  subjectDropdownList.appendChild(makeItem(filterItemTemp, { subject_code: -1, subject_name: "Toate materiile" }));
  data.forEach(function (itemData) {
    subjectDropdownList.appendChild(makeItem(filterItemTemp, itemData));
  });
}

function fillLevelFilter(data) {
  levelDropdownList.innerHTML = '';
  levelDropdownList.appendChild(makeItem(levelFilterItemTemp, { level_code: -1, level_name: "Toate nivelurile" }));
  data.forEach(function (itemData) {
    levelDropdownList.appendChild(makeItem(levelFilterItemTemp, itemData));
  });
}

function sendSubjectsRequest() {
  // Retrieve levels
  const ENDPOINT = API_ENDPOINT + "/subjects";
  getData(ENDPOINT)
    .then(subjects => {
      subjectList = subjects.subjects;
      levelList = subjects.levels;
      fillSubjectFilter(subjectList);

      // Get search parameters from URL
      let params = new URLSearchParams(location.search);
      select_subject(params.get("materie"), /*skipRequest=*/true);
      select_level(params.get("nivel"), /*skipRequest=*/true);
      select_price(params.get("pret"), /*skipRequest=*/true);

      sendTutorListRequest();
    })
}
