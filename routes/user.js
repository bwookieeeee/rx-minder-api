const router = require("express").Router();
const uuid = require("uuid");


// This is a temporary solution until a database is added:
let users = require("../dummy/users.json").users;

router.get("/", (req, res) => {
  res.sendStatus(405);
})
router.patch("/", (req, res) => {
  res.sendStatus(405);
})
router.delete("/", (req, res) => {
  res.sendStatus(405);
})

router.get("/:username", (req, res) => {
  console.debug(`GET /users/${req.params.username}`)
  const user = users.find(usr => usr.username === req.params.username);
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send({ error: "User does not exist" });
  }
})

router.post("/", (req, res) => {
  console.debug(`POST /users`);
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

router.patch("/:username", (req, res) => {
  console.debug(`PATCH /users/${req.params.username}`)
  let target = users.find(usr => usr.username === req.params.username);
  if (target) {
    const targetIdx = users.indexOf(target);
    const updated = {
      id: target.id,
      username: target.username,
      passwdHash: req.body.passwdHash ? req.body.passwdHash : target.passwdHash,
      apiKey: target.apiKey,
      email: req.body.email ? req.body.email : target.email,
      firstName: req.body.firstName ? req.body.firstName : target.firstName,
      lastName: req.body.lastName ? req.body.lastName : target.lastName,
      linkedRxs: req.body.linkedRxs ? req.body.linkedRxs : target.linkedRxs,
      linkedReminders: req.body.linkedReminders ? req.body.linkedReminders : target.linkedReminders
    }

    users[targetIdx] = updated;
    res.status(200).send(updated);
  } else {
    res.sendStatus(404);
  }
})


module.exports = router;