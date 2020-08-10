<!DOCTYPE html>
<html>
  <title>W3.CSS</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
  <body>

    <header class="w3-container w3-teal">
      <h1>Test login / register</h1>
    </header>

      <!-- Login form -->
      <div class="w3-container w3-half w3-margin-top" style="margin-left: 25%">

        <h2>Login form</h2>
        <form id="login-form" class="w3-container w3-card-4" action="api/login.api.php" method="post">

          <p>
          <input id="input-email" class="w3-input" type="email" name="email" style="width:90%" required>
          <label>Email</label>
          </p>

          <p>
          <input id="input-password" class="w3-input" type="password" name="password" style="width:90%" required>
          <label>Password</label>
          </p>

          <p>
          <button type="button" onclick="submit_form()" class="w3-button w3-section w3-teal w3-ripple"> Log in </button>

          <a href="register.php" class="w3-button w3-text-teal w3-ripple"> Don't have an account? Create one here </a>
          </p>

        </form>
        
        <p id="debug">a</p>

    </div>

    <!-- Firebase App (the core Firebase SDK) is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/7.17.0/firebase-app.js"></script>

    <!-- If you enabled Analytics in your project, add the Firebase SDK for Analytics -->
    <script src="https://www.gstatic.com/firebasejs/7.17.0/firebase-analytics.js"></script>

    <!-- Add Firebase products that you want to use -->
    <script src="https://www.gstatic.com/firebasejs/7.17.0/firebase-auth.js"></script>

    <script>
      // TODO: Replace the following with your app's Firebase project configuration
      const firebaseConfig = {
        apiKey: "AIzaSyAuicRqWF_5tePJnIIu_lo8Rohlp6Z09DA",
        authDomain: "meditatii-b7c86.firebaseapp.com",
        databaseURL: "https://meditatii-b7c86.firebaseio.com",
        projectId: "meditatii-b7c86",
        storageBucket: "meditatii-b7c86.appspot.com",
        messagingSenderId: "492006053765",
        appId: "1:492006053765:web:a60cb7235f3082849f16ec",
        measurementId: "G-0DN2ZFE4BP"
      };

      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);

      function submit_form() {
        var login_form = document.getElementById("login-form");
        var email_field = document.getElementById("input-email");
        var password_field = document.getElementById("input-password");
        firebase.auth().createUserWithEmailAndPassword(email_field.value, password_field.value).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          document.getElementById("debug").innerHTML = errorCode + " " + errorMessage;
        });
        //login_form.submit();
      }
    </script>
  </body>
</html> 

