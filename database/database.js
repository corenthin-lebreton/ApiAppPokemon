const mongoose = require("mongoose");
const { connect } = mongoose;
require("dotenv").config({
  path: "/home/corenthin/ApiPokemonApp/database/.env",
});

try {
  const PASSWORD = process.env.PASSWORD;
  const CLUSTER = process.env.CLUSTER;
  connect(
    `mongodb+srv://root:${PASSWORD}@${CLUSTER}/?retryWrites=true&w=majority`
  );

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("connected to mongodb");
  });
  db.on("disconnected", function () {
    console.log("disconnected from mongodb");
  });
} catch (error) {
  console.log(error);
}
