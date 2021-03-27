firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User signed in
    console.log("User logged in");
    // validate();
  } else {
    // User signed out
    console.log("User logged out");
  }
});

function validate() {
  var user = firebase.auth().currentUser;
  user.getIdToken(/* forceRefresh */ true).then(function(idToken) {
    // send token to backend
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("Responded: " + this.responseText);
      }
    };
    const ENDPOINT = "http://gv281.user.srcf.net:8080/api/validate";
    req.open("POST", ENDPOINT, true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify({"token": idToken}));
  }).catch(function (error) {
    // Handle error
    console.log("Error in retrieving user token: " + error.message);
  });
}
