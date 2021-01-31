const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Film = require("./models/filmovi");
const Zanr = require("./models/zanr");
const cors = require("cors");
const app = express();

mongoose.connect("mongodb://mongo:27017/baze", { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Connected to MOngoDB");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pocetna");
});

const film = require("./routes/filmovi");
const zanr = require("./routes/zanrovi");
app.use("/filmovi", film);
app.use("/zanr", zanr);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
