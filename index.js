const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const { version } = require("./package.json");
  res.status(200).send({ version: version })
})

app.use("/users", require("./routes/user"));
app.use("/scrips", require("./routes/scrip"));
app.use("/reminders", require("./routes/reminder"));

app.listen(3000);