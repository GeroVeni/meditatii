const HOME_PAGE = "/";
responseMessage = document.getElementById("response");

let signup_google = document.getElementById("signup-google");
let signup_facebook = document.getElementById("signup-facebook");

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

function createDBUser(user) {
  user.getIdToken(true).then(function (token) {
    // create new user
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log('response text');
        console.log(this.responseText);
        console.log("redirecting...");
        window.location.href = HOME_PAGE;
      }
    };
    const ENDPOINT = API_ENDPOINT + "/register";
    let data = {
      token: token,
      name: '',
      surname: ''
    };
    if (loginMethod == 'form') {
      data.name = name_field.value;
      data.surname = surname_field.value;
    } else {
      let nameSurname = splitName(user.displayName);
      data.name = nameSurname[0];
      data.surname = nameSurname[1];
    }
    console.log(`Attempting to add user: ${JSON.stringify(data)}`);
    console.log(`Login method: ${loginMethod}`);
    req.open("POST", ENDPOINT, true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify(data));
  });
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
    loginMethod = 'third-party-login';

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
    var displayName = user.displayName;
    var email = user.email;
    console.log("User logged in: " +
      displayName + " - " +
      email);
    if (loginMethod == 'none') {
      console.log('Login method: ' + loginMethod);
      window.location.href = HOME_PAGE;
    } else {
      createDBUser(user);
    }
  } else {
    // User signed out
    console.log("User logged out");
  }
});

function submit_form() {
  var login_form = document.getElementById("email-form");
  var email_field = login_form["Email"];
  var password_field = login_form["Password"];
  firebase.auth().signInWithEmailAndPassword(email_field.value, password_field.value).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + " " + errorMessage);
    responseMessage.innerHTML = "<p style='color:red'; text-allign:'center'><strong>Parola introdusă este incorectă sau contul nu există</strong></p>";
  });
}
