let registered = false;

let login_form = document.getElementById("email-form");
let error_message = document.getElementById("error-message");
let name_field = login_form["name"];
let surname_field = login_form["Surname"];
let email_field = login_form["email"];
let password_field = login_form["Password"];
let confirm_password_field = login_form["Confirm-password"];
let over_16_check = login_form["checkbox"];

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
        let data = {
          token: token,
          name: name_field.value,
          surname: surname_field.value
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

function checkForm() {
  if (password_field.value != confirm_password_field.value) {
    // Passwords no matching
    error_message.style.display = "";
    error_message.innerHTML = "Parola nu se potrivește.";
    return false;
  }
  return true;
}

function submit_form() {
  registered = true;
  if (!checkForm()) return false;
  
  firebase.auth().createUserWithEmailAndPassword(email_field.value, password_field.value).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + " " + errorMessage);
    error_message.style.display = "";
    if (errorCode == "auth/email-already-in-use") {
      error_message.innerHTML = "Există un cont cu această adresă de mail.";
    } else {
      error_message.innerHTML = errorMessage;
    }
  });
  return true;
}
