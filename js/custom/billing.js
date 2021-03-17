let params = new URLSearchParams(location.search);
let booking_id = params.get('b');
let form = document.getElementById("wf-form-billing-form");



function billing(){
    let full_name = document.getElementById("fullName").value;
    let country = document.getElementById("country").value;
    let county = document.getElementById("county").value;
    let city = document.getElementById("city").value;
    let postal_code = document.getElementById("postalcode").value;
    let adress = document.getElementById("adress1").value;
    let optional_adress = document.getElementById("adress2").value;
    let email = document.getElementById("email").value;
    let promo_code = document.getElementById("promo-code").value;
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            user.getIdToken(true).then(function(idToken){
            var req = new XMLHttpRequest();
            req.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    var data = JSON.parse(this.responseText);
                    let order_number = data[0].order_number;
                    var req = new XMLHttpRequest();
                    req.onreadystatechange = function(){
                        if(this.readyState == 4 && this.status == 200){
                            var data = JSON.parse(this.responseText);
                            let response_code = data.affectedRows;
                            if (response_code == 1){
                                var req = new XMLHttpRequest();
                                req.onreadystatechange = function(){
                                    if (this.readyState == 4 && this.status == 200){
                                        var data = JSON.parse(this.responseText);
                                        console.log(data["formUrl"]);
                                        window.location.replace(data.formUrl);
                                    }
                                };
                                const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/bookings/pay";
                                req.open("POST",ENDPOINT,true);
                                req.setRequestHeader("Content-type", "application/json");
                                req.send(JSON.stringify({"orderNumber":order_number,"amount":4500}));
                            }
                        }
                    };
                    const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/orders/write";
                    req.open("POST", ENDPOINT, true);
                    req.setRequestHeader("Content-type", "application/json");
                    let json = {"full_name":full_name,
                    "email":email,
                    "adress_req":adress,
                    "adress_optional":optional_adress,
                    "country":country,
                    "county":county,
                    "city":city,
                    "postal_code":postal_code,
                    "promo_code":promo_code,
                    "order_number":order_number};
                    console.log(json);
                    req.send(JSON.stringify(json));
                }
            };
            const ENDPOINT = "https://gv281.user.srcf.net/meditatii/api/bookings/order_number?token="+idToken+"&booking_id="+booking_id;
            req.open("GET", ENDPOINT, true);
            req.send();
            });
        }
    });
}

form.onsubmit = function(){
    billing();
};