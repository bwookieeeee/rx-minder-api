const router = require("express").Router();
const uuid = require("uuid");


// This is a temporary solution until a database is added:
let users = require("../dummy/users.json").users;

router.get("/", (req, res) => {
  console.debug(`GET /user`)
  const user = users.find(usr => usr.username === req.body.username);
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send({ error: "User does not exist" });
  }
})

router.post("/", (req, res) => {
  console.debug(`POST /user`);
  try {
    if (users.find(usr => usr.username === req.body.username)) {
      res.status(400).send({ error: "User already exists" });
    } else {
      let user = req.body;
      user.id = uuid.v4();
      user.apiKey = uuid.v4();
      users.push(user);
      res.status(201).send(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
})

module.exports = router;