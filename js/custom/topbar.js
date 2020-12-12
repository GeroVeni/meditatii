firebase.auth().onAuthStateChanged(function(user) {
  var logout_bar = document.getElementById("logout-bar");
  var login_bar = document.getElementById("login-bar");

  if (user) {
    // User signed in
    var displayName = user.email;
    var dashboard_button = document.getElementById("dashboard-button");
    login_bar.style.display="none";
    logout_bar.style.display="inline";
  } else {
    // User signed out
    login_bar.style.display="inline";
    logout_bar.style.display="none";
  }
});

function logout() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log("Signout success");
    location.href = '/';
  }).catch(function(error) {
    // An error happened.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + " " + errorMessage);
  });
}
