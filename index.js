const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const { version } = require("./package.json");
  res.status(200).send({ version: version })
})

app.use("/user", require("./routes/user"));
app.use("/scrip", require("./routes/scrip"));
app.use("/reminder", require("./routes/reminder"));

app.listen(3000);