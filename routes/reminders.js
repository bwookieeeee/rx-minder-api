const router = require("express").Router();
const uuid = require("uuid");
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "rxminder",
  password: "password",
  host: "127.0.0.1"
});

router.get("/", (req, res) => { res.sendStatus(405) });
router.patch("/", (req, res) => { res.sendStatus(405) });
router.delete("/", (req, res) => { res.sendStatus(405) });

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.debug(`GET /reminders/${id}`);
  await pool.query("SELECT * FROM reminders WHERE id=$1 LIMIT 1", [id])
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
    })
});

router.post("/", async (req, res) => {
  console.debug("POST /reminders");
  const { userId, interval, nextFire, scrips, doses } = req.body;
  const id = uuid.v4();
  await pool.query("INSERT INTO reminders (id, userid, interval, nextfire, scrips, doses) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [
    id, userId, interval, nextFire, scrips, doses
  ])
    .then(results => {
      res.status(201).send(results.rows[0]);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
})

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { interval, nextFire, scrips, doses } = req.body;
  console.debug(`PATCH /reminders/${id}`);

  await pool.query("SELECT * FROM reminders WHERE id=$1 LIMIT 1", [id])
    .then(async results => {
      if (results.rowCount > 0) {
        const target = results.rows[0];
        await pool.query("UPDATE reminders SET (interval, nextfire, scrips, doses) = ($1, $2, $3, $4) RETURNING *", [
          interval ? interval : target.interval,
          nextFire ? nextFire : target.nextFire,
          scrips ? scrips : target.scrips,
          doses ? doses : target.doses
        ])
          .then(results => {
            res.status(200).send(results.rows[0]);
          }).catch(err => {
            console.error(err);
            res.sendStatus(500);
          })
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })

})

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.debug(`DELETE /reminders/${id}`);

  await pool.query("DELETE FROM reminders WHERE id=$1", [id])
    .then(results => {
      res.sendStatus(204);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
})

module.exports = router;