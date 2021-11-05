const express = require("express");

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

app.use("/users", require("./routes/users"));
app.use("/scrips", require("./routes/scrips"));
app.use("/reminders", require("./routes/reminders"));

app.listen(3000);