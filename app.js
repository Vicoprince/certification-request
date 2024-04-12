require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const UserRequest = require('./models/userRequest');

const app = express();

const dbURI = process.env.MONGODB_CONNECTION_STRING;
mongoose.connect(dbURI)
    .then((result) => {
      app.listen(3000);
      console.log("Connected to db");
    })
    .catch((err) => {
      console.log(err);
    });

app.set("view engine", "ejs");
app.use(morgan("dev"));
//takes all the url encoded data from the form and parses it into an object for use in the req object
app.use(express.urlencoded({ extended: true })); 
// rendering static css files
app.use(express.static("assets"));


app.get("https://certification-request.netlify.app", (req, res) => {
  res.render("request_form", { title: "Request Form" });
});

app.get('/request_submitted', (req, res) => {
  res.render("request_submitted", { title: "Successful Submission" });
});

// handling a post request
app.post("/submitting_request", (req, res) => {
  // console.log(req.body);
  const userRequest = new UserRequest(req.body);

  userRequest
    .save()
    .then((result) => {
      res.redirect("/request_submitted");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404 Page" });
});
