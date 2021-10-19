let searchBar = document.getElementById("search");
let searchList = document.getElementById("search-list");
let subjectList = null;
let searchItemTemp = '<a class="w3-button" onclick="searchSubject({subject_code})" style="display: block; margin: 0px 5px;">{subject_name}</a>';

const ENDPOINT = API_ENDPOINT + "/subjects";
getData(ENDPOINT)
  .then(response => {
    subjectList = response.subjects
  })

function filterSubjects(filter) {
  return subjectList.filter(subject =>
    subject.subject_name.toUpperCase().indexOf(filter.toUpperCase()) > -1
  );
}

searchBar.oninput = function () {
  let filter = this.value;
  if (filter == "" || subjectList == null) {
    // Nothing to search
    searchList.style.display = "none";
  } else {
    // Display matching subjects
    searchList.style.display = "";
    searchList.innerHTML = "";
    filterSubjects(filter).forEach(subject => {
      searchList.appendChild(makeItem(searchItemTemp, subject));
    });
  }
}

function submitSubjectForm() {
  let filtered = filterSubjects(searchBar.value);
  let arg = '';
  if (searchBar.value == '' || filtered.length == 0) {
    arg = '';
  } else {
    arg = '?materie=' + filtered[0].subject_code;
  }
  window.location.href = "/tutori.html" + arg;
  return false;
}

function searchSubject(code) {
  window.location.href = "/tutori.html?materie=" + code;
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User logged in, check if he has to send a tutor message
    if (getCookie('tutor-message') != "") {
      // Parse cookie
      let msg = JSON.parse(getCookie('tutor-message'));
      // Get user token
      user.getIdToken(true).then(idToken => {
        // Send message
        let sublev = msg.subject.split(',');
        let data = {
          recipient: msg.tutor,
          message_type: "text",
          message: msg.content,
          email: 1,
          subject_code: sublev[0],
          level_code: sublev[1]
        };
        const ENDPOINT = API_ENDPOINT + "/messages";
        postData(ENDPOINT, idToken, data)
          .then(() => {
            window.location.href = "/mesagerie.html?u=" + msg.tutor;
          })
      });
      setCookie('tutor-message', '');
    }
  }
});

