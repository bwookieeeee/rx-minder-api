const router = require("express").Router();
const uuid = require("uuid");

const reminders = require("../dummy/reminders.json").reminders;

router.get("/", (req, res) => { res.sendStatus(405) });
router.patch("/", (req, res) => { res.sendStatus(405) });
router.delete("/", (req, res) => { res.sendStatus(405) });

router.get("/:id", (req, res) => {
  const { id } = req.params;
  console.debug(`GET /reminders/${id}`);
  const target = reminders.find(rem => rem.id === id);
  if (target) {
    res.status(200).send(target);
  } else {
    res.sendStatus(404);
  }
});

router.post("/", (req, res) => {
  console.debug("POST /reminders");
  // There's not a good way to check for a duplicate reminder
  let reminder = req.body;
  reminder.id = uuid.v4();
  reminders.push(reminder);

  res.status(201).send(reminder);
})

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { interval, nextFire, scrips, doses } = req.body;
  console.debug(`PATCH /reminders/${id}`);

  const target = reminders.find(rem => rem.id === id);
  if (target) {
    const targetIdx = reminders.indexOf(target);
    const updated = {
      id: target.id,
      userId: target.userId,
      interval: interval ? interval : target.interval,
      nextFire: nextFire ? nextFire : target.nextFire,
      scrips: scrips ? scrips : target.scrips,
      doses: doses ? doses : target.doses
    }

    reminders[targetIdx] = updated;

    res.status(200).send(updated);
  } else {
    res.sendStatus(404);
  }

})

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  console.debug(`DELETE /reminders/${id}`);

  const target = reminders.find(rem => rem.id === id);
  if (target) {
    reminders.splice(reminders.indexOf(target), 1);
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
})

module.exports = router;