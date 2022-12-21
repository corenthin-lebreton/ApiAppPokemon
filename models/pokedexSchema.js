const { model, Schema } = require("mongoose");

const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  pokemons: [],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Pokedex", schema, "pokedex");
