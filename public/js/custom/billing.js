let params = new URLSearchParams(location.search);
let booking_id = params.get('b');
let form = document.getElementById("wf-form-billing-form");

let full_name_elem = document.getElementById("fullName")
let country_elem = document.getElementById("country")
let county_elem = document.getElementById("county")
let city_elem = document.getElementById("city")
let postal_code_elem = document.getElementById("postalcode")
let adress_elem = document.getElementById("adress1")
let optional_adress_elem = document.getElementById("adress2")
let email_elem = document.getElementById("email")
let promo_code_elem = document.getElementById("promo-code")
let save_billing_info_checkbox = document.getElementById("save-billing-info-checkbox")

firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "/"
    return
  }
  // Load billing info from user profile
  user.getIdToken(true).then(async idToken => {
    let billingResponse = await getData(API_ENDPOINT + `/bookings/${booking_id}/order`, idToken)
    if (!billingResponse) billingResponse = await getData(API_ENDPOINT + "/users/me/billing", idToken)
    full_name_elem.value = billingResponse.fullName
    country_elem.value = billingResponse.country
    county_elem.value = billingResponse.county
    city_elem.value = billingResponse.city
    postal_code_elem.value = billingResponse.postal_code
    adress_elem.value = billingResponse.address_req
    optional_adress_elem.value = billingResponse.address_optional
    email_elem.value = user.email
    promo_code_elem.value = ""
  })
})

function billing() {
  let fullName = full_name_elem.value;
  let country = country_elem.value;
  let county = county_elem.value;
  let city = city_elem.value;
  let postal_code = postal_code_elem.value;
  let adress = adress_elem.value;
  let optional_adress = optional_adress_elem.value;
  let email = email_elem.value;
  let promo_code = promo_code_elem.value;

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      user.getIdToken(true).then(idToken => {
        let billingInfoData = {
          fullName: fullName,
          email,
          address_req: adress,
          address_optional: optional_adress,
          country,
          county,
          city,
          postal_code,
          promo_code,
        };
        console.log(billingInfoData);
        if (save_billing_info_checkbox.checked) {
          postData(API_ENDPOINT + "/users/me/billing", idToken, billingInfoData)
            .then(response => {
              console.log(response)
            })
            .catch(err => {
              console.log(err)
              postData(API_ENDPOINT + "/users/me/billing", idToken, billingInfoData, 'PATCH')
            })
        }
        const ENDPOINT = API_ENDPOINT + `/bookings/${booking_id}/order`;
        postData(ENDPOINT, idToken, billingInfoData, 'PUT')
          .then(data => {
            if (data) {
              const ENDPOINT = API_ENDPOINT + `/bookings/${booking_id}/pay`;
              postData(ENDPOINT, idToken)
                .then(data => {
                  console.log(data);
                  // window.location.href = data.formUrl
                })
            }
          })
      });
    }
  });
}

form.onsubmit = function () {
  billing();
};