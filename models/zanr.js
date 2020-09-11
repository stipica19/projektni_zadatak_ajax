const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const zanrSchema = mongoose.Schema({

    naziv: String,

});
module.exports = mongoose.model("Zanr", zanrSchema);