const userSettingsForm = document.getElementById('user-settings-form');
const nameField = userSettingsForm['name'];
const surnameField = userSettingsForm['surname'];

const tutorLoggedInTab = document.getElementById('tutor-logged-in');
const tutorLoggedOutTab = document.getElementById('tutor-logged-out');

const tutorSettingsForm = document.getElementById('tutor-settings-form');
const descriptionField = tutorSettingsForm['description'];
const aboutMeField = tutorSettingsForm['about-me'];
const aboutSessionsField = tutorSettingsForm['about-sessions'];
const maxHoursField = tutorSettingsForm['max-hours'];
const gradesField = tutorSettingsForm['grades'];
const priceField = tutorSettingsForm['price'];
const educationField = tutorSettingsForm['education'];

// Set listener for user login
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User signed in
    user.getIdToken(/* forceRefresh */ true)
      .then(idToken => loadUserSettings(idToken))
      .then(() => { console.log('user data loaded'); })
      .catch(err => { console.error(err); });
  } else {
    // User signed out
    const HOME_PAGE = '/';
    window.location.href = HOME_PAGE;
  }
});

// Update user field values
function updateFields(content) {
  nameField.value = content.name;
  surnameField.value = content.surname;
}

// Update tutor field values
function updateTutorFields(content) {
  descriptionField.value = content.description;
  aboutMeField.value = content.about_me;
  aboutSessionsField.value = content.about_sessions;
  maxHoursField.value = content.max_hours;
  gradesField.value = JSON.stringify(content.grades);
  priceField.value = content.price;
  educationField.value = content.education.place;
}

// Load function for user settings
async function loadUserSettings(idToken) {
  const query = `?token=${idToken}`;
  let response = await fetch(API_ENDPOINT + '/users/me' + query);
  let result = await response.json();
  let user = result[0];
  updateFields(user);
  if (user.roles.includes('tutor')) {
    tutorLoggedInTab.style.display = "";
    // Load tutor settings
    let username = user.username;
    response = await fetch(API_ENDPOINT + '/tutors/' + username);
    let tutor = await response.json();
    updateTutorFields(tutor);
  } else {
    tutorLoggedOutTab.style.display = "";
  }
  
}

// Update function for user settings
async function updateUserSettings(idToken) {
  const requestData = {
    token: idToken,
    name: nameField.value,
    surname: surnameField.value
  }
  console.log('update user data');
  console.log(requestData);
  let response = await fetch(API_ENDPOINT + '/users/me', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(requestData)
  });
  let result = await response.json();
  updateFields(result[0]);
}

// Update function for tutor settings
async function updateTutorSettings(idToken) {
  const requestData = {
    token: idToken,
    description: descriptionField.value,
    about_me: aboutMeField.value,
    about_sessions: aboutSessionsField.value,
    max_hours: maxHoursField.value,
    grades: JSON.parse(gradesField.value),
    price: priceField.value,
    education: {
      place: educationField.value
    }
  };
  console.log('update tutor data');
  console.log(requestData);
  let response = await fetch(API_ENDPOINT + '/tutors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(requestData)
  });
  let result = await response.json();
  updateTutorFields(result);
}

// User info update button clicked
function onUpdateUserSettingsSubmit () {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
    .then(idToken => updateUserSettings(idToken))
    .then(() => { console.log('user data updated'); })
    .catch(err => { console.error(err); });
  return false;
}

// Tutor info update button clicked
function onUpdateTutorSettingsSubmit () {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
    .then(idToken => updateTutorSettings(idToken))
    .then(() => { console.log('tutor data updated'); })
    .catch(err => { console.error(err); });
  return false;
}

function openTab(evt, tabName, defaultTarget, not_redirect = false) {
  var i, x, tablinks;
  x = document.getElementsByClassName('settings-tab');
  for (i = 0; i < x.length; i++) {
    x[i].style.display = 'none';
  }
  tablinks = document.getElementsByClassName('tab-link');
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' w3-theme', ''); 
  }
  document.getElementById(tabName).style.display = 'block';
  let target = defaultTarget;
  if (evt) target = evt.currentTarget;
  target.className += ' w3-theme';
  var url = window.location.href.split('?')[0];
  if (!not_redirect) location.replace(url + '?tab=' + tabName);
}

const urlParams = new URLSearchParams(window.location.search);
let tab = urlParams.get('tab');
if (!tab) tab = 'personal';
openTab(null, tab, document.getElementById(tab + '-tab'), true);
