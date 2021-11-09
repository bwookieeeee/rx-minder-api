const db = require("../components/db").users
const router = require("express").Router();


/*
 *  Send a 405 on /users on GET, PATCH, DELETE since we don't want to do this
 *  to all our users.
 */
router.get("/", (req, res) => { res.sendStatus(405) })
router.patch("/", (req, res) => { res.sendStatus(405) })
router.delete("/", (req, res) => { res.sendStatus(405) })

/**
 * GET /users/:id
 * 
 * Fetch a single user from the database.
 * 200 if found
 * 404 if not
 * 500 for all errors
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`GET /users/${id}`)

  await db.getUserById(id, (status, payload) => {
    res.status(status).send(payload);
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
  const { username, passwd, email, firstName, lastName } = req.body;
  
  await db.createUser({
    username: username,
    password: passwd,
    email: email,
    firstname: firstName,
    lastname: lastName
  }, (status, payload) => {
    res.status(status).send(payload);
  })
})

/**
 * PATCH /users/:id
 * 
 * Update a user in the database. ID and username are not modifiable.
 * 200 if OK
 * 404 if user not exists
 * 500 for all errors
 */
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  console.debug(`PATCH /users/${id}`)
  
  await db.changeUsernameById(req.body, (status, payload) => {
    res.status(status).send(payload);
  })
})

/**
 * DELETE /users/:id
 * 
 * Delete a user from the database
 * 204 if deleted (or not, results doesn't have ability to show if not deleted)
 * 500 for all errors
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.debug(`DELETE /users/${id}`)
  
  await db.deleteUserByID(id, (status, payload) => {
    res.status(status).send(payload);
  })
})

module.exports = router;