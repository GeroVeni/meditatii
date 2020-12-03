const userSettingsForm = document.getElementById('user-settings-form');
const nameField = userSettingsForm['name'];
const surnameField = userSettingsForm['surname'];

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
  educationField.value = JSON.stringify(content.education);
}

// Load function for user settings
async function loadUserSettings(idToken) {
  const query = `?token=${idToken}`;
  let response = await fetch(API_ENDPOINT + '/users/me' + query);
  let result = await response.json();
  let user = result[0];
  updateFields(user);
  if (user.roles.includes('tutor')) {
    // TODO: Disable tutor
    // Load tutor settings
    let username = user.username;
    response = await fetch(API_ENDPOINT + '/tutors/' + username);
    let tutor = await response.json();
    updateTutorFields(tutor);
  }
  
}

// Update function for user settings
async function updateUserSettings(idToken) {
  let response = await fetch(API_ENDPOINT + '/users/me', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: idToken,
      name: nameField.value,
      surname: surnameField.value
    })
  });
  let result = await response.json();
  updateFields(result[0]);
}

// Update button clicked
function onUpdateUserSettingsSubmit () {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
    .then(idToken => updateUserSettings(idToken))
    .then(() => { console.log('user data updated'); })
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
    tablinks[i].className = tablinks[i].className.replace(' w3-red', ''); 
  }
  document.getElementById(tabName).style.display = 'block';
  let target = defaultTarget;
  if (evt) target = evt.currentTarget;
  target.className += ' w3-red';
  var url = window.location.href.split('?')[0];
  if (!not_redirect) location.replace(url + '?tab=' + tabName);
}

const urlParams = new URLSearchParams(window.location.search);
let tab = urlParams.get('tab');
if (!tab) tab = 'personal';
openTab(null, tab, document.getElementById(tab + '-tab'), true);
