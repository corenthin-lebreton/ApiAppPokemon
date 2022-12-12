const express = require("express");
require("dotenv").config({
  path: "/home/corenthin/ApiPokemonApp/database/.env",
});
const usersRouter = require("../ApiPokemonApp/routes/users.route");
require("../ApiPokemonApp/database/.env");
require("../ApiPokemonApp/database/database.js");

const app = express();
const PORT = process.env.PORT || 3010;

app.use(express.json());

app.use((err, req, res, next) => {
  if (err) {
    res.status(400).send("Erreur de requête");
    return;
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/", usersRouter);
