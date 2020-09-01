var tutorList = document.getElementById("tutor-list-container");
var tutorTemp = 
'<div id="tutor-list-container" class="container-6 _2 w-container">' +
  '<div class="w-row">' +
    '<div class="w-col w-col-3"><img src="{photo_link}" height="303" sizes="(max-width: 767px) 96vw, (max-width: 991px) 167px, 220px" alt="" class="image-5"></div>' +
    '<div class="w-col w-col-6">' +
      '<h1 class="heading-4 list">{full_name}<br></h1>' +
      '<div class="text-block-12 list">{education}</div>' +
      '<div class="text-block-3 list">{description}</div>' +
      '<h5 class="heading-28">{subjects}</h5>' +
    '</div>' +
    '<div class="column-3 w-col w-col-3">' +
      '<div class="text-block-7 list">{price}/ORĂ<br>‍</div>' +
      '<div class="text-block-8 list"><br><span class="text-span-7">{hours_taught}</span> <span class="text-span-8">de ore predate</span><br></div><img src="images/4stars.png" width="114" srcset="images/4stars-p-500.png 500w, images/4stars-p-800.png 800w, images/4stars.png 900w" sizes="114px" alt="" class="image-13 list">' +
      '<div class="text-block-18 list">{reviews} review-uri</div><a href="tutor-profile.html?username={username}" class="button-6 w-button">Vezi profilul! </a>' +
    '</div>' +
  '</div>' +
'</div>';

function makeListItem(itemData) {
  var item = tutorTemp;
  item = item.replace("{full_name}", itemData.name + " " + itemData.surname);
  item = item.replace("{description}", itemData.description);
  item = item.replace("{photo_link}", itemData.photo_link);
  item = item.replace("{hours_taught}", "20");
  item = item.replace("{reviews}", "5");
  item = item.replace("{price}", itemData.price);
  var education = JSON.parse(itemData.education);
  item = item.replace("{education}", education.place);
  item = item.replace("{subjects}", "Matematică / Fizică / Chimie");
  item = item.replace("{username}", itemData.username);
  return item;
}

function fillTutorList(data) {
  tutorList.innerHTML = "";
  data.forEach(function (itemData) {
    var item = document.createElement("DIV");
    item.innerHTML = makeListItem(itemData);
    tutorList.appendChild(item.firstChild);
  });
}

function sendTutorListRequest() {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      fillTutorList(JSON.parse(this.responseText));
    }
  };
  const ENDPOINT = "http://gv281.user.srcf.net:8080/api/tutors";
  req.open("GET", ENDPOINT, true);
  req.send();
}

function refresh() {
  sendTutorListRequest();
}

// Main
refresh();
