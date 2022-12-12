const { model, Schema } = require("mongoose");

const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  pokemons: [Object],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Pokedex", schema, "pokedex");
