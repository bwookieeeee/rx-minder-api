const express = require("express");
const uuid = require("uuid");


const app = express();

app.use(express.json());

const users = require("./dummy/users.json");
const scrips = require("./dummy/scrips.json");
const reminders = require("./dummy/reminders.json");

app.get("/", (req, res) => {
  const { version } = require("./package.json");
  res.status(200).send({ version: version })
})

app.get("/user", (req, res) => {
  const user = users.users.find(usr => usr.username === req.body.username);
  if (user) {
    res.send(user);
  } else {
    res.sendStatus(404);
  }
})

app.post("/user", (req, res) => {
  try {
    if (users.users.find(usr => usr.username === req.body.username)) {
      res.status(400).send({ error: "User already exists. Cannot create." });
    } else {

      let user = req.body;
      user.id = uuid.v4();
      user.apiKey = uuid.v4();
      users.users.push(user)
      res.status(201).send(user)
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
})

app.listen(3000);