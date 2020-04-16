const mongoose = require("mongoose");

const HeroiSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  poder: {
    type: String,
    required: true,
  },
  insertAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("herois", HeroiSchema);
