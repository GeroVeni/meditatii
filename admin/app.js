// Includes
const https = require('https');
const http = require('http');
const admin = require('firebase-admin');
const mysql = require('mysql');
const fs = require('fs');
const url = require('url');

// SSL keys and options
const KEY_PATH = "keys/SSL/key.pem";
const CERT_PATH = "keys/SSL/cert.pem";
const options = {
  key: fs.readFileSync(KEY_PATH),
  cert: fs.readFileSync(CERT_PATH)
};

// Firebase admin setup
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://meditatiiweb.firebaseio.com"
});

// MySQL connection
var con = mysql.createConnection({
  host: "localhost",
  user: "gv281",
  password: "!1keepmydatasafe",
  database: "gv281/rttw"
});

// Start server
// https.createServer(options, function (req, res) {
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"});

  var q = url.parse(req.url, true);
  var path = q.pathname.split('/');
  path = path.slice(1);
  var ans = {};
  if (path[0] == 'api') {
    // Api calls
    if (path[1] == 'tutors') {
      // Tutors API
      if (path.length == 2 || path[2] == '') {
        con.query("SELECT t.*, u.name, u.surname, u.username FROM tutors as t, users as u where t.user_id = u.user_id", function (err, result, fields) {
          if (err) {
            ans = "DATABASE QUERY FAILED: " + err.message;
            res.write(JSON.stringify(ans));
            res.end();
            return;
          }
          res.write(JSON.stringify(result));
          res.end();
        });
      } else {
        con.query("SELECT t.*, u.name, u.surname, u.username FROM tutors as t, users as u where t.user_id = u.user_id AND u.username = ?", [path[2]], function (err, result, fields) {
          if (err) {
            ans = "DATABASE QUERY FAILED: " + err.message;
            res.write(JSON.stringify(ans));
            res.end();
            return;
          }
          if (result.length == 0) {
            res.write(JSON.stringify("NO TUTORS FOUND WITH THIS USERNAME"));
            res.end();
          } else {
            res.write(JSON.stringify(result[0]));
            res.end();
          }
        });
      }
    } else if (path[1] == 'validate') {
      // validate test
      ans = "";
      req.on('data', (chunk) => {
        ans += chunk;
      });
      req.on('end', () => {
        var jsonAns = {};
        try {
          jsonAns = JSON.parse(ans);
        } catch (err) {
          res.write("Error parsing json text sent by request.");
          res.end();
          return;
        }
        if (jsonAns === undefined || !('token' in jsonAns)) {
          res.write("Json request does not contain a 'token' property.");
          res.end();
          return;
        }
        admin.auth().verifyIdToken(jsonAns.token)
          .then((decodedToken) => {
            let email = decodedToken.email;
            res.write(JSON.stringify(email));
            res.end();
          }).catch((error) => {
            console.log(error.code + ": " + error.message);
          });
      });
    } else {
      ans = {code: 404, message: "Index not found"};
      res.write(JSON.stringify(ans));
      res.end();
    }
  } else {
    ans = {code: 404, message: "Index not found"};
    res.write(JSON.stringify(ans));
    res.end();
  }
}).listen(8080);

