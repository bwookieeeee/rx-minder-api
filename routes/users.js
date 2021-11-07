const router = require("express").Router();
const uuid = require("uuid");
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "rxminder",
  password: "password",
  database: "rxminder",
  host: "127.0.0.1",
})

/*
 *  Send a 405 on /users on GET, PATCH, DELETE since we don't want to do this
 *  to all our users.
 */
router.get("/", (req, res) => { res.sendStatus(405) })
router.patch("/", (req, res) => { res.sendStatus(405) })
router.delete("/", (req, res) => { res.sendStatus(405) })

/**
 * GET /users/:username
 * 
 * Fetch a single user from the database.
 * 200 if found
 * 404 if not
 * 500 for all errors
 */
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

/**
 * POST /users
 * 
 * Create a new user
 * 201 if created
 * 400 if already exists
 * 500 for all errors
 */
router.post("/", async (req, res) => {
  console.debug(`POST /users`);
  const { username, passwd, email, firstName, lastName, linkedRxs, linkedReminders } = req.body;
  const bcrypt = require("bcrypt");
  const passwdHash = bcrypt.hash(passwd, 10, async (err, hash) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      await pool.query("INSERT INTO users (id, username, passwdHash, apiKey, email, firstName, lastName, linkedRxs, linkedReminders) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [uuid.v4(), username, hash, uuid.v4(), email, firstName, lastName, linkedRxs, linkedReminders])
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
    }
  })
})

/**
 * PATCH /users/:username
 * 
 * Update a user in the database. ID and username are not modifiable.
 * 200 if OK
 * 404 if user not exists
 * 500 for all errors
 */
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

/**
 * DELETE /users/:username
 * 
 * Delete a user from the database
 * 204 if deleted (or not, results doesn't have ability to show if not deleted)
 * 500 for all errors
 */
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