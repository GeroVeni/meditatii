firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User signed in
    var HOME_PAGE = "/";
    window.location.href = HOME_PAGE;
  } else {
    // User signed out
    console.log("User logged out");
  }
});

function submit_form() {
  var login_form = document.getElementById("email-form");
  var name_field = login_form["name"];
  var surname_field = login_form["surname"];
  var email_field = login_form["email"];
  var password_field = login_form["Password"];
  var confirm_password_field = login_form["Confirm-password"];
  var date_of_birth_field = login_form["Date-of-birth"];
  firebase.auth().createUserWithEmailAndPassword(email_field.value, password_field.value).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + " " + errorMessage);
  });
  return true;
}
