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
  console.debug(`GET /scrips/${id}`);
  await pool.query("SELECT * FROM scrips WHERE id=$1 LIMIT 1", [id])
    .then(results => {
      if (results.rowCount > 0) {
        res.status(200).send(results.rows[0]);
      } else {
        res.sendStatus(404);
      }
    }).catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
})

router.post("/", async (req, res) => {
  const { rxNum, name, strength, stock, instructions, warnings } = req.body;
  console.debug(`POST /scrips`);
  await pool.query("INSERT INTO scrips (id, rxnum, name, strength, stock, instructions, warnings) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [uuid.v4(), rxNum, name, strength, stock, instructions, warnings])
    .then(results => {
      res.status(201).send(results.rows[0]);
    })
    .catch(err => {
      if (err.code === "23505") {
        res.status(400).send({ error: "scrip already exists" });
      }
      console.error(err);
      res.sendStatus(500);
    })
})

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, strength, stock, instructions, warnings } = req.body;
  console.debug(`PATCH /scrips/${id}`);

  await pool.query("SELECT * FROM scrips WHERE id=$1", [id])
    .then(async results => {
      if (results.rowCount > 0) {
        const target = results.rows[0];
        await pool.query("UPDATE scrips SET (name, strength, stock, instructions, warnings) = ($1, $2, $3, $4, $5) RETURNING *", [
          name ? name : target.name,
          strength ? strength : target.strength,
          stock ? stock : target.stock,
          instructions ? instructions : target.instructions,
          warnings ? warnings : target.warnings
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
  console.debug(`DELETE /scrips/${id}`);
  await pool.query("DELETE FROM scrips WHERE id=$1", [id])
    .then(results => {
      res.sendStatus(204);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
})

module.exports = router;