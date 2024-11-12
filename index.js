const express = require("express");
const app = express();
require("./time/time");

app.get("/", (req, res) => {
  res.send("Welcome to my Express.js server!");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
