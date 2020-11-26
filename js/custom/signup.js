const HOME_PAGE = '/';

let error_message = document.getElementById("error-message");
let signup_google = document.getElementById("signup-google");
let signup_facebook = document.getElementById("signup-facebook");
let login_form = document.getElementById("email-form");
let name_field = login_form["name"];
let surname_field = login_form["Surname"];
let email_field = login_form["email"];
let password_field = login_form["Password"];
let confirm_password_field = login_form["Confirm-password"];
let over_16_check = login_form["checkbox"];

signup_google.onclick = () => {
  let provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('email');
  firebase.auth().signInWithRedirect(provider);
};

signup_facebook.onclick = () => {
  let provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('email');
  firebase.auth().signInWithRedirect(provider);
}

function createDBUser(user) {
  user.getIdToken(true).then(function (token) {
    // create new user
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("redirecting...");
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
}

firebase.auth().getRedirectResult()
  .then(function(result) {
    if (result.credential) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // TODO: Custom stuff
    }
    // The signed-in user info.
    var user = result.user;
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
    createDBUser(user);
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
  if (!checkForm()) return false;
  
  firebase.auth().createUserWithEmailAndPassword(email_field.value, password_field.value)
  .then(userCredentials => {
    console.log(userCredentials.user);
  })
  .catch(function(error) {
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
