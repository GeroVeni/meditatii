let userSettingsForm = document.getElementById('user-settings-form');
let nameField = userSettingsForm['name'];
let surnameField = userSettingsForm['surname'];

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

// Update field values
function updateFields(content) {
  nameField.value = content.name;
  surnameField.value = content.surname;
}

// Load function for user settings
async function loadUserSettings(idToken) {
  const query = `?token=${idToken}`;
  let response = await fetch(API_ENDPOINT + '/users/me' + query);
  let result = await response.json();
  updateFields(result[0]);
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
    .catch(err => { console.log(err); });
  return false;
}
