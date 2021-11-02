const express = require("express");
// const uuid, { v4 } = require("uuid");


const app = express();

app.use(express.json());

const users = require("./dummy/users.json");
const scrips = require("./dummy/scrips.json");
const reminders = require("./dummy/reminders.json");

app.get("/", (req, res) => {
  res.send(204);
})

app.listen(3000);