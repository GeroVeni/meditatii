const sessionField = document.getElementById('session-field')
const tutorField = document.getElementById('tutor-field')
const ratingStars = document.getElementById('tutor-rating-stars')
const ratingComment = document.getElementById('feedback')

let bookingId = '';
let subject_code = 0;
let level_code = 0;
let tutor_username = ''
let student_username = ''

function submitFeedback() {
  let rating = ratingStars['data-rating'];
  let comment = ratingComment.value;
  firebase.auth().currentUser.getIdToken(true).then(async (token) => {
    const ENDPOINT = API_ENDPOINT;
    const requestData = {
      tutor_username,
      student_username,
      rating,
      comment,
      date: new Date(),
      subject_code,
      level_code
    };
    console.log(requestData)
    let response = await postData(ENDPOINT + "/reviews", token, requestData)
    console.log(response);
    location.href = '/programari.html'
  })
}

async function displayLastSession(idToken) {
  const ENDPOINT = API_ENDPOINT;
  let booking = await getData(ENDPOINT + `/bookings/${bookingId}`, idToken);

  if (!booking) {
    console.log("No bookings found");
    location.href = '/'
    return;
  }
  subject_code = booking.subject.subject.subject_code
  level_code = booking.subject.level.level_code

  const user = await getData(ENDPOINT + `/users/me`, idToken);
  if (user.username != booking.student_username) {
    location.href = '/'
    return
  }
  student_username = user.username

  const tutor = await getData(ENDPOINT + `/tutors/${booking.tutor_username}`);
  tutor_username = tutor.username

  sessionField.textContent = `${booking.subject.subject.subject_name}, ${booking.subject.level.level_name}`
  tutorField.textContent = `${tutor.name} ${tutor.surname}`;
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User signed in
    let params = new URLSearchParams(location.search);
    bookingId = params.get('b');
    // if (bookingId === null) location.href = '/';
    user.getIdToken(/* forceRefresh */ true).then(token => {
      displayLastSession(token);
    });
  } else {
    // User signed out
    window.location.href = "/";
  }
});
