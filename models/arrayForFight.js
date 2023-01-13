const { model, Schema } = require("mongoose");

const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  pokemonsForFight: [Number],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("ArrayForFight", schema, "arrayForFight");
