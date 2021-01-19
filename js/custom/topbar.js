firebase.auth().onAuthStateChanged(function(user) {
  var logout_bars = document.getElementsByClassName("logout-bar");
  var login_bars = document.getElementsByClassName("login-bar");

  if (user) {
    // User signed in
    var displayName = user.email;
    var dashboard_button = document.getElementById("dashboard-button");
    for (let i = 0; i < login_bars.length; ++i) { login_bars[i].style.display = "none"; }
    for (let i = 0; i < logout_bars.length; ++i) { logout_bars[i].style.display = "inline"; }
  } else {
    // User signed out
    for (let i = 0; i < login_bars.length; ++i) { login_bars[i].style.display = "inline"; }
    for (let i = 0; i < logout_bars.length; ++i) { logout_bars[i].style.display = "none"; }
  }
});

function toggleSideBar() {
  var x = document.getElementById('collapsible-side-bar');
  if (x.className.indexOf('w3-show') == -1) {
    x.className += ' w3-show';
  } else {
    x.className = x.className.replace(' w3-show', '');
  }
}

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
