const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const passport = require("passport");
const csp = require("express-csp-header");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  csp({
    policies: {
      "default-src": [csp.NONE],
      "img-src": [csp.SELF],
    },
  })
);

// HTTP response header will be defined as:
// "Content-Security-Policy: default-src 'none'; img-src 'self';"

// DB Config
const MONGO_DB = require("./config/keys").mongoURI;

// connect to mongoDB
mongoose
  .connect(MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false, // used so that findOneAndUpdate() works
  })
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

const PORT = process.env.PORT || 5000;

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
