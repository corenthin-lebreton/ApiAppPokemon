const { model, Schema } = require("mongoose");

const schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  pokedollarz: { type: Number, required: true },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("User", schema, "users");
