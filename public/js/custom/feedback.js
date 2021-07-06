const sessionField = document.getElementById('session-field');
const tutorField = document.getElementById('tutor-field');

let tutor_username = '';
let subject_code = 0;
let level_code = 0;

function submitFeedback() {
  let rating = ratingStars['data-rating'];
  let comment = ratingComment.value;
  firebase.auth().currentUser.getIdToken(true).then(async (token) => {
    const BASE_URL = "https://gv281.user.srcf.net/meditatii/dev/api";
    const requestData = {
      token,
      review: {
        tutor_username,
        rating,
        comment,
        subject_code,
        level_code
      }
    };
    let response = await fetch(BASE_URL + '/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(requestData)
    });
    console.log('Value: ' + rating + ' ' + comment);
    console.log(await response.json());
  })
}

async function displayLastSession(token) {
  const BASE_URL = "https://gv281.user.srcf.net/meditatii/api";
  const query = `?token=${token}&other=${tutor_username}&last=1`;
  let response = await fetch(BASE_URL + '/bookings' + query);
  let result = await response.json();

  if (result.length == 0) {
    console.log("No bookings found");
    return;
  }
  const booking = result[0];
  response = await fetch(BASE_URL + `/tutors/${tutor_username}`);
  const tutor = await response.json();
  if ('code' in tutor) {
    window.href = '/';
    return;
  }

  response = await fetch(BASE_URL + '/subjects');
  const subjectList = await response.json();
  response = await fetch(BASE_URL + '/levels');
  const levelList = await response.json();

  const subject = subjectList.find(s => s.subject_code == booking.subject_id);
  const level = levelList.find(l => l.level_code == booking.level_id);

  subject_code = booking.subject_id;
  level_code = booking.level_id;

  sessionField.textContent = `${subject.subject_name}, ${level.level_name}`
  tutorField.textContent = `${tutor.name} ${tutor.surname}`;
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User signed in
    let params = new URLSearchParams(location.search);
    tutor_username = params.get('u');
    if (tutor_username === null) location.href = '/';
    // TODO: Check tutor exists
    user.getIdToken(/* forceRefresh */ true).then(token => {
      displayLastSession(token, tutor_username);
    });
  } else {
    // User signed out
    window.location.href = "/";
  }
});
