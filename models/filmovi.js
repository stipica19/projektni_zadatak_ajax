const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const filmSchema = mongoose.Schema({
  ime: String,
  opis: String,
  godina_izdanja: String,
  trajanje: Number,
  cijena: Number,
  jezik: String,
  id_zanra: { type: mongoose.Schema.Types.ObjectId, ref: "Zanr" },
});
module.exports = mongoose.model("Film", filmSchema);
