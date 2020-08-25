//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  // Daten aus dem POST holen
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  // Daten für Mailchimp request body
  var data = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
  };
  var jsonData = JSON.stringify(data);
  console.log(jsonData);

  // Parameter für den Request
  const url = "https://us17.api.mailchimp.com/3.0/lists/49fefb47b9/members";
  const options = {
    method: "POST",
    auth: process.en.mailchimpauth,

  };

  // HTTPRequest Objekt erstellen
  const request = https.request(url, options, response => {
    response.on("data", data => {
      console.log(JSON.parse(data));
      console.log(response.statusCode);
      if(response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }

    });
  });

  // Daten in den Request setzen
  request.write(jsonData);
  request.end();
});

app.listen(port, () => {
  console.log("Listening to port " + port);
});
// {"email_address":"","email_type":"","status":"subscribed","merge_fields":{},"interests":{},"language":"","vip":false,"location":{"latitude":0,"longitude":0},"marketing_permissions":[],"ip_signup":"","timestamp_signup":"","ip_opt":"","timestamp_opt":"","tags":[]}
// API Key
// 99640d8f646c7f3c42221fc5ea0298cb-us17
// List ID
// 49fefb47b9
