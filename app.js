//jshint esversion: 6
const dotenv = require('dotenv').config()
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
 const key = process.env.mailchimpauth;
 console.log(key);
  // Parameter für den Request
  const url = "https://us17.api.mailchimp.com/3.0/lists/49fefb47b9/members";
  const options = {
    method: "POST",
    auth: key,

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
