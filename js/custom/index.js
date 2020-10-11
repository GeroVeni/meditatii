let searchBar = document.getElementById("search");
let searchList = document.getElementById("search-list");
let subjectList = null;
let searchItemTemp = '<a class="w3-button" onclick="searchSubject({subject_code})" style="display: block; margin: 0px 5px;">{subject_name}</a>';

let req = new XMLHttpRequest();
req.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    subjectList = JSON.parse(this.responseText);
  }
};
const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/subjects";
req.open("GET", ENDPOINT, true);
req.send();

searchBar.oninput = function () {
  let filter = this.value;
  if (filter == "" || subjectList == null) {
    // Nothing to search
    searchList.style.display = "none";
  } else {
    // Display matching subjects
    searchList.style.display = "";
    searchList.innerHTML = "";
    subjectList.forEach(function (subject) {
      let name = subject.subject_name;
      if (name.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
        searchList.appendChild(makeItem(searchItemTemp, subject));
      }
    });
  }
}

function searchSubject(code) {
  window.location.href = "/mentori.html?materie=" + code;
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User logged in, check if he has to send a
    // tutor message
    if (getCookie('tutor-message') != "") {
      // Parse cookie
      let msg = JSON.parse(getCookie('tutor-message'));
      // Get user token
      user.getIdToken(true).then(idToken => {
        // Send message
        let json = {
          token: idToken,
          recipient: msg.tutor,
          message_type: "text",
          message: "Asking for " + msg.subject + " \n" + msg.content,
          email: 1
        };
        const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/messages";
        req.open("POST", ENDPOINT, true);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(JSON.stringify(json));
      });
      setCookie('tutor-message', '');
    }
  }
});

