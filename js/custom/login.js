responseMessage = document.getElementById("response");

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User signed in
    var displayName = user.displayName;
    var email = user.email;
    var photoURL = user.photoURL;
    var uid =  user.uid;
    console.log("User logged in: " +
      displayName + " - " +
      email + " - " +
      uid);
    var HOME_PAGE = "/";
    window.location.href = HOME_PAGE;
  } else {
    // User signed out
    console.log("User logged out");
  }
});

function submit_form() {
  var login_form = document.getElementById("email-form");
  var email_field = login_form["Email"];
  var password_field = login_form["Password"];
  firebase.auth().signInWithEmailAndPassword(email_field.value, password_field.value).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + " " + errorMessage);
    responseMessage.innerHTML = "<p style='color:red'; text-allign:'center'><strong>Parola introdusă este incorectă sau contul nu există</strong></p>";  
  });
}
