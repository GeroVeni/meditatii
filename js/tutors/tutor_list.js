var tutor_list = document.getElementById("tutor-list-container");
var tutor_temp = document.getElementById("tutor-item-template");

var clon = tutor_temp.content.cloneNode(true);
tutor_list.appendChild(clon);
clon = tutor_temp.content.cloneNode(true);
tutor_list.appendChild(clon);
