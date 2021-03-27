function logout() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log("Signout success");
  }).catch(function(error) {
    // An error happened.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + " " + errorMessage);
  });
}
