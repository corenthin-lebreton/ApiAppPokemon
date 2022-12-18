const express = require("express");
require("dotenv").config();
const usersRouter = require("./routes/users.route");
const pokedexRouter = require("./routes/pokedex.route");
require("./database/database.js");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
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
app.use("/", pokedexRouter);
