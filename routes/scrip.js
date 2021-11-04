const router = require("express").Router();
const uuid = require("uuid");

let scrips = require("../dummy/scrips.json").scrips;

router.get("/", (req, res) => { res.sendStatus(405) });
router.patch("/", (req, res) => { res.sendStatus(405) });
router.delete("/", (req, res) => { res.sendStatus(405) });

router.get("/:id", (req, res) => {
  console.debug(`GET /scrips/${req.params.id}`);

  const target = scrips.find(scr => scr.id === req.params.id);
  if (target) {
    res.status(200).send(target);
  } else {
    res.sendStatus(404);
  }
})

router.post("/", (req, res) => {
  console.debug(`POST /scrips`);

  try {
    if (scrips.find(scr => scr.rxNum === req.body.rxNum)) {
      res.status(400).send({ error: "Scrip already exists" });
    } else {
      let scrip = req.body;
      scrip.id = uuid.v4();
      scrips.push(scrip);
      res.status(201).send(scrip);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
})

router.patch("/:id", (req, res) => {
  console.debug(`PATCH /scrips/${req.params.id}`);

  let target = scrips.find(scr => scr.id === req.params.id);
  if (target) {
    const targetIdx = scrips.indexOf(target);
    const updated = {
      id: target.id,
      rxNum: target.rxNum,
      name: req.body.name ? req.body.name : target.name,
      strength: req.body.strength ? req.body.strength : target.strength,
      stock: req.body.stock ? req.body.stock : target.stock,
      instructions: req.body.instructions ? req.body.instructions : target.instructions,
      warnings: req.body.warnings ? req.body.warnings : target.warnings
    }
    scrips[targetIdx] = updated;
    res.status(200).send(updated);
  } else {
    res.sendStatus(404);
  }
})

router.delete("/:id", (req, res) => {
  console.debug(`DELETE /scrips/${req.params.id}`);
  const target = scrips.find(scr => scr.id === scr.id);
  if (target) {
    scrips.splice(scrips.indexOf(target), 1);
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
})

module.exports = router;