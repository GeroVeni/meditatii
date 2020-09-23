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
  window.location.href = "/razvan/mentori.html?materie=" + code;
}
