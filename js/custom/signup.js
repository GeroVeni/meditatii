let registered = false;

var login_form = document.getElementById("email-form");
var name_field = login_form["name"];
var surname_field = login_form["Surname"];
var email_field = login_form["email"];
var password_field = login_form["Password"];
var confirm_password_field = login_form["Confirm-password"];
var date_of_birth_field = login_form["Date-of-birth"];
var over_16_check = login_form["checkbox"];

firebase.auth().onAuthStateChanged(function(user) {
  var HOME_PAGE = "/";
  if (user) {
    // User signed in
    if (registered) {
      // get user id token
      user.getIdToken(true).then(function (token) {
        // create new user
        let req = new XMLHttpRequest();
        req.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            window.location.href = HOME_PAGE;
          }
        };
        const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/register";
        let date = date_of_birth_field.value;
        let data = {
          token: token,
          name: name_field.value,
          surname: surname_field.value,
          date_of_birth: date.slice(6, 10) + '-' + date.slice(3, 5) + '-' + date.slice(0, 2)
        };
        req.open("POST", ENDPOINT, true);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(JSON.stringify(data));
      });
    } else {
      window.location.href = HOME_PAGE;
    }
  } else {
    // User signed out
    console.log("User logged out");
  }
});

function submit_form() {
  registered = true;
  firebase.auth().createUserWithEmailAndPassword(email_field.value, password_field.value).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + " " + errorMessage);
  });
  return true;
}
