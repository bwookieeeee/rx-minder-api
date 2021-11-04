const router = require("express").Router();
const uuid = require("uuid");


// This is a temporary solution until a database is added:
let users = require("../dummy/users.json").users;

router.get("/", (req, res) => { res.sendStatus(405) })
router.patch("/", (req, res) => { res.sendStatus(405) })
router.delete("/", (req, res) => { res.sendStatus(405) })

router.get("/:username", (req, res) => {
  const { username } = req.params;
  console.debug(`GET /users/${username}`)
  const user = users.find(usr => usr.username === username);
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
  const { username } = req.params;
  const { passwdHash, email, firstName, lastName, linkedReminders, linkedRxs } = req.body;
  console.debug(`PATCH /users/${username}`)
  let target = users.find(usr => usr.username === username);
  if (target) {
    const targetIdx = users.indexOf(target);
    const updated = {
      id: target.id,
      username: target.username,
      passwdHash: passwdHash ? passwdHash : target.passwdHash,
      apiKey: target.apiKey,
      email: email ? email : target.email,
      firstName: firstName ? firstName : target.firstName,
      lastName: lastName ? lastName : target.lastName,
      linkedRxs: linkedRxs ? linkedRxs : target.linkedRxs,
      linkedReminders: linkedReminders ? linkedReminders : target.linkedReminders
    }

    users[targetIdx] = updated;
    res.status(200).send(updated);
  } else {
    res.sendStatus(404);
  }
})

router.delete("/:username", (req, res) => {
  const { username } = req.params;
  console.debug(`DELETE /users/${username}`)
  const target = users.find(usr => usr.username === username);
  if (target) {
    users.splice(users.indexOf(target), 1);
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
})

module.exports = router;