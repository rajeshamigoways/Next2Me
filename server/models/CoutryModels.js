const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema({
  code: String,
  name: String,
  subdivision: String,
});

const CountrySchema = new mongoose.Schema({
  code2: String,
  code3: String,
  name: String,
  capital: String,
  region: String,
  subregion: String,
  states: [StateSchema],
});

module.exports = mongoose.model("Country", CountrySchema);
