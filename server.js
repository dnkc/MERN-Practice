const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const passport = require("passport");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const MONGO_DB = require("./config/keys").mongoURI;

// connect to mongoDB
mongoose
  .connect(
    "mongodb+srv://nagard:1DK2mongo3@cluster0.yrwwa.mongodb.net/socialmedia?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false, // used so that findOneAndUpdate() works
    }
  )
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

const PORT = 5000 || process.env.PORT;

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
