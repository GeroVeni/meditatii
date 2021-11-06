const API_ENDPOINT = "https://gv281.user.srcf.net/meditatii/api";
// const API_ENDPOINT = "https://gv281.user.srcf.net/meditatii/dev/api";
// const API_ENDPOINT = "http://localhost:9090/api";

async function postData(url = '', idToken = '', data = {}, method = 'POST') {
  allowedMethods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  if (!allowedMethods.includes(method)) {
    throw Error(`Specified method not allowed ${method}`)
  }
  // Default options are marked with *
  const response = await fetch(url, {
    method, // GET, POST, PUT, DELETE, etc.
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  if (response.status > 399) {
    throw new Error(`Error in request response with code ${response.status}: ${JSON.stringify(response.json())}`)
  }
  return response.json(); // parses JSON response into native JavaScript objects
}

async function getData(url = '', idToken = '') {
  // Default options are marked with *
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.json(); // parses JSON response into native JavaScript objects
}