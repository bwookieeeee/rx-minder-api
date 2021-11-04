const router = require("express").Router();
const uuid = require("uuid");
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "rxminder",
  password: "password",
  database: "rxminder",
  host: "127.0.0.1",
})

router.get("/", (req, res) => { res.sendStatus(405) })
router.patch("/", (req, res) => { res.sendStatus(405) })
router.delete("/", (req, res) => { res.sendStatus(405) })

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  console.debug(`GET /users/${username}`)

  await pool.query("SELECT * FROM users WHERE username=$1 LIMIT 1", [username])
    .then(results => {
      if (results.rowCount > 0) {
        res.status(200).send(results.rows[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
})

router.post("/", async (req, res) => {
  console.debug(`POST /users`);
  const { username, passwdHash, email, firstName, lastName, linkedRxs, linkedReminders } = req.body;
  await pool.query("INSERT INTO users (id, username, passwdHash, apiKey, email, firstName, lastName, linkedRxs, linkedReminders) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    [uuid.v4(), username, passwdHash, uuid.v4(), email, firstName, lastName, linkedRxs, linkedReminders])
    .then(results => {
      res.status(201).send(results.rows[0]);
    }).catch(err => {
      if (err.code === "23505") {
        res.status(400).send({ error: "User already exists" });
      } else {
        console.error(err);
        res.sendStatus(500);
      }
    })
})

router.patch("/:username", async (req, res) => {
  const { username } = req.params;
  const { passwdHash, email, firstName, lastName, linkedReminders, linkedRxs } = req.body;
  console.debug(`PATCH /users/${username}`)

  await pool.query("SELECT * FROM users WHERE username=$1 LIMIT 1", [username])
    .then(async results => {
      if (results.rowCount > 0) {
        const tmpUser = results.rows[0]
        await pool.query("UPDATE users SET (passwdHash, email, firstName, lastName, linkedRxs, linkedReminders) = ($1, $2, $3, $4, $5, $6) where username = $7 RETURNING *",
          [
            passwdHash ? passwdHash : tmpUser.passwdhash,
            email ? email : tmpUser.email,
            firstName ? firstName : tmpUser.firstname,
            lastName ? lastName : tmpUser.lastname,
            linkedRxs ? linkedRxs : tmpUser.linkedrxs,
            linkedReminders ? linkedReminders : tmpUser.linkedreminders,
            username
          ])
          .then(results => {
            res.status(200).send(results.rows[0]);
          })
          .catch(err => {
            console.error(err);
            res.sendStatus(500);
          })
      } else {
        res.sendStatus(404);
      }
    }).catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
})

router.delete("/:username", async (req, res) => {
  const { username } = req.params;
  console.debug(`DELETE /users/${username}`)
  await pool.query("DELETE FROM users WHERE username=$1 returning *", [username])
    .then(results => {
      // There's nothing in results that indicates a 404...
      res.sendStatus(204);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
})

module.exports = router;