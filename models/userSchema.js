const { model, Schema } = require("mongoose");

const schema = new Schema({
  username: String,
  password: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("User", schema, "users");
