responseMessage = document.getElementById("response");

let signup_google = document.getElementById("signup-google");
let signup_facebook = document.getElementById("signup-facebook");
let loader = document.getElementById('loader-div');

signup_google.onclick = () => {
  loginMethod = 'google';
  setCookie('third-party-login', 'google');
  let provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('email');
  firebase.auth().signInWithRedirect(provider);
};

signup_facebook.onclick = () => {
  loginMethod = 'facebook';
  setCookie('third-party-login', 'facebook');
  let provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('email');
  firebase.auth().signInWithRedirect(provider);
}

if (getCookie('third-party-login') != '') {
  loader.style.display = '';
  setCookie('third-party-login', '');
}

firebase.auth().getRedirectResult()
  .then(function(result) {
    console.log('redirect result');
    console.log(result);

    if (result.credential) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // TODO: Custom stuff
    }
    // The signed-in user info.
    var user = result.user;

    if (user.email == null) {
      let newEmail = result.additionalUserInfo.profile.email;
      if (newEmail == null) {
        // TODO: Should prompt the user for an email
        console.log('no email found');
      } else {
        user.updateEmail(newEmail).then(function() {
          // Update successful.
          console.log('added email');
        }).catch(function(error) {
          // An error happened.
          console.log(error);
        });
      }
    }

    console.log('finished getRedirectResult');
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + ": " + errorMessage);
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // TODO: Custom stuff
  });

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
