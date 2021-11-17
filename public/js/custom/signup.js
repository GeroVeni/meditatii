const HOME_PAGE = '/';

let error_message = document.getElementById("error-message");
let signup_google = document.getElementById("signup-google");
let signup_facebook = document.getElementById("signup-facebook");
let login_form = document.getElementById("email-form");
let name_field = login_form["name"];
let surname_field = login_form["Surname"];
let email_field = login_form["email"];
let phone_field = login_form["phone"];
let password_field = login_form["Password"];
let confirm_password_field = login_form["Confirm-password"];
let over_16_check = login_form["checkbox"];

// Method specifies the way the user selected to sign up
// Possible values: 'none', 'form', 'google', 'facebook'
// None means user is already logged in so do not register.
let loginMethod = 'none';
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

function splitName(name) {
  let splitName = name.split(' ');
  if (splitName.length == 1) {
    return [name, ''];
  }
  return [splitName.slice(0, splitName.length - 1).join(' '), splitName[splitName.length - 1]];
}

function convertPhoneNumberToE164(num) {
  if (num.startsWith('+40')) return num
  return '+40' + num
}

function createDBUser(user) {
  user.getIdToken(true)
    .then(async idToken => {
      try {
        const me = await getData(API_ENDPOINT + '/users/me', idToken)
        if (me) {
          console.log('User already exists')
          return
        }
      } catch (err) { console.error(err) }
      let data = {
        name: '',
        surname: '',
        phoneNumber: ''
      };
      const referrer = getCookie("referrer")
      if (referrer) {
        data.referrer = referrer
      }
      if (loginMethod == 'form') {
        data.name = name_field.value
        data.surname = surname_field.value
        data.phoneNumber = convertPhoneNumberToE164(phone_field.value)
      } else {
        let nameSurname = splitName(user.displayName)
        data.name = nameSurname[0]
        data.surname = nameSurname[1]
        data.phoneNumber = user.phoneNumber
      }
      console.log(`Attempting to add user: ${JSON.stringify(data)}`);
      console.log(`Login method: ${loginMethod}`);
      const ENDPOINT = API_ENDPOINT + "/users";
      return postData(ENDPOINT, idToken, data)
    })
    .then(() => {
      console.log("redirecting...");
      // window.location.href = HOME_PAGE;
    })
    .catch(err => console.log(err));
}

firebase.auth().getRedirectResult()
  .then(function (result) {
    console.log('redirect result');
    console.log(result);

    if (result.user == null) {
      loader.display.style = 'none';
      return;
    }

    if (result.credential) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // TODO: Custom stuff
    }
    // The signed-in user info.
    var user = result.user;
    loginMethod = 'third-party';

    if (user.email == null) {
      let newEmail = result.additionalUserInfo.profile.email;
      if (newEmail == null) {
        // TODO: Should prompt the user for an email
        console.log('no email found');
      } else {
        user.updateEmail(newEmail).then(function () {
          // Update successful.
          console.log('added email');
        }).catch(function (error) {
          // An error happened.
          console.log(error);
        });
      }
    }

    console.log('finished getRedirectResult');
  })
  .catch(function (error) {
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

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User signed in
    console.log('User logged in');
    if (loginMethod == 'none') {
      console.log('Login method: ' + loginMethod);
      // window.location.href = HOME_PAGE;
    } else {
      createDBUser(user);
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
  error_message.style.display = "none";
  if (!checkForm()) return false;

  loginMethod = 'form';
  firebase.auth().createUserWithEmailAndPassword(email_field.value, password_field.value)
    .then(userCredentials => {
      console.log(userCredentials.user);
      loginMethod = 'form';
    })
    .catch(function (error) {
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
