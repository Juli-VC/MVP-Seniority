var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

const stripe = require("@stripe/stripe-js");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var activitiesRouter = require("./routes/activities");
var adminRouter = require("./routes/admin");

var app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/activities", activitiesRouter);
app.use("/admin", adminRouter);

module.exports = app;
