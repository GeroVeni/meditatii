var tutorList = document.getElementById("tutor-list-container");
var tutorTemp = document.getElementById("tutor-item-template");

var clon = tutorTemp.content.cloneNode(true);
tutorList.appendChild(clon);
clon = tutorTemp.content.cloneNode(true);
tutorList.appendChild(clon);
