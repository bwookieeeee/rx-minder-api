const express = require("express");
const passport = require("passport-local");


const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://brookebot.xyz");
  res.header("Access-Control-Allow-Headers", "*");
  next();
})

app.get("/", (req, res) => {
  const { version } = require("./package.json");
  res.status(200).send({ version: version })
})

app.get("/login", async (req, res) => {
  const Pool = require("pg").Pool;
  const pool = new Pool({ host: "127.0.0.1", port: 5432, user: "rxminder", password: "password", database: "rxminder" });
  const bcrypt = require("bcrypt");
  const authsplit = req.headers.authorization.split(" ")
  const decoded = Buffer.from(authsplit[1], "base64").toString("ascii");
  const decodesplit = decoded.split(":")
  const results = await pool.query("SELECT * FROM users WHERE username=$1", [decodesplit[0]])
  try {

    bcrypt.compare(decodesplit[1], results.rows[0].passwdhash, (err, result, query=results) => {
      if (err) {
        console.error(err);
        res.status(401).send({ error: "invalid username or password" });
      } else {
        res.status(200).send(query.rows[0]);
      }
    })
  } catch (err) {
    res.sendStatus(401);
  }
})

app.use("/users", require("./routes/users"));
app.use("/scrips", require("./routes/scrips"));
app.use("/reminders", require("./routes/reminders"));

app.listen(3000);