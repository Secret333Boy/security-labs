const uuid = require("uuid");
const express = require("express");
const onFinished = require("on-finished");
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// get from env
const JWT_SECRET = "jwt_secret";

const users = [
  {
    login: "Login",
    password: "Password",
    username: "Username",
  },
  {
    login: "Login1",
    password: "Password1",
    username: "Username1",
  },
];

app.get("/", (req, res) => {
  try {
    const token = req.get("Authorization")?.replace("Bearer ", "");

    const tokenPayload = jwt.verify(token, JWT_SECRET);

    const user = users.find(({ login }) => login === tokenPayload.login);

    if (user) {
      return res.json({
        username: user.username,
        logout: "http://localhost:3000/logout",
      });
    }
  } catch (e) {
    console.error(e);
    res.status(401);
  }

  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/logout", (req, res) => {
  res.redirect("/");
});

app.post("/api/login", (req, res) => {
  const { login, password } = req.body;

  const user = users.find((user) => {
    if (user.login === login && user.password === password) {
      return true;
    }
    return false;
  });

  if (user) {
    const token = jwt.sign({ login }, JWT_SECRET, {
      expiresIn: "10s",
    });

    return res.json({ token });
  }

  res.status(401).send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
