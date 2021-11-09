const Pool = require("pg").Pool;
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const settings = require("../settings");

const pool = new Pool({
  user: settings.db.user,
  password: settings.db.password,
  database: settings.db.database,
  host: settings.db.host,
  port: settings.db.port
})

/**
 * @callback results
 * @param {number} status HTTP status code
 * @param {Object} payload data to send
 */

/**
 * get a single user by their ID
 * 
 * @param {uuid.v4} id the username to query
 * @param {results} results
 */
async function getUserById(id, results) {
  console.debug(`Querying users for ${id}`);

  try {
    const res = await pool.query("SELECT * FROM users WHERE id=$1 LIMIT 1", [id]);
    if (res.rowCount > 0) {
      return results(200, res.rows[0]);
    } else {
      return results(404, { error: "not found" });
    }
  } catch (err) {
    console.error(err);
    return results(500, { error: "Internal server error" });
  }
}

/**
 * create a new user
 * 
 * @param {Object} user user payload
 * @param {results} results 
 */
async function createUser(user, results) {
  console.debug(`Creating user ${user.username}`);
  const { username, password, email, firstname, lastname } = user;
  try {
    bcrypt.hash(password, settings.bcrypt.saltRounds, async (err, enc) => {
      if (err) {
        console.error(err);
        return results(500, { error: "Internal server error" });
      }
      const id = uuid.v4();
      const apikey = Buffer.from(JSON.stringify({ id: id, username: username, time: Date.now() })).toString("base64");
      try {
        const res = await pool.query("INSERT INTO users (id, username, passwdhash, apikey, email, firstname, lastname, linkedrxs, linkedreminders) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
          [
            id, username, enc, apikey, email, firstname, lastname, [], []
          ]);
        return results(201, res.rows[0]);
      } catch (err) {
        if (err.code === "23505") return results(400, { error: "User already exists" });
        console.err(err);
        return results(500, { error: "internal server error" });
      }
    })
  } catch (err) {
    console.error(err);
    return results(500, { error: "internal server error" })
  }
}

/**
 * Change user data of the designated ID
 * 
 * @param {Object} user the user payload
 * @param {results} results 
 */
async function changeUsernameById(user, results) {
  console.debug(`updating user ${user.id}`);
  const { id, passwd, email, firstname, lastname, linkedrxs, linkedreminders } = user;
  let newpasswd;
  if (passwd) {
    newpasswd = bcrypt.hashSync(passwd, settings.bcrypt.saltRounds);
  }

  try {

    const targetQuery = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    if (targetQuery.rows.length === 0) {
      return results(404, { error: "user not found" });
    }

    const target = targetQuery.rows[0];
    const query = await pool.query("UPDATE users SET (passwdhash, email, firstname, lastname, linkedrxs, linkedreminders) = ($1, $2, $3, $4, $5, $6) where id = $7 returning *", [
      newpasswd ? newpasswd : target.passwdhash,
      email ? email : target.email,
      firstname ? firstname : target.firstname,
      lastname ? lastname : target.lastname,
      linkedrxs ? linkedrxs : target.linkedrxs,
      linkedreminders ? linkedreminders : target.linkedreminders,
      id
    ])
    return results(200, query.rows[0]);
  } catch (err) {
    console.error(err);
    return results(500, { error: "internal server error" })
  }
}

/**
 * Delete a user with the ID
 * 
 * @param {uuid.v4} id user ID to delete
 * @param {results} results payload
 */
async function deleteUserByID(id, results) {
  console.debug(`Deleting user ${id}`);

  try {
    await ("DELETE FROM users WHERE id=$1", [id]);
    return results(204, null);
  } catch (err) {
    console.error(err);
    return results(500, { error: "internal server error" });
  }
}

module.exports = {
  users: {
    getUserById,
    createUser,
    changeUsernameById,
    deleteUserByID
  }
}