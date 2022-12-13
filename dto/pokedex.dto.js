const Pokedex = require("../models/pokedexSchema");

const checkCreatePokedex = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = req.user;

    const pokedex = await Pokedex.findOne({ user: user._id });
    if (pokedex) {
      res.status(400).json({ message: "Vous avez déjà un pokedex." });
      return;
    }

    if (name === null || name === undefined) {
      res.status(400).json({ message: "Entrez un nom d'utilisateur valide" });
      return;
    }

    if (name?.length <= 0) {
      res.status(400).json({ message: "Entrez un nom d'utilisateur valide" });
      return;
    }

    if (name?.length < 2) {
      res.status(400).json({ message: "Entrer un nom plus grand." });
      return;
    }

    if (name?.length >= 30) {
      res.status(400).json({ message: "Entrer un nom plus petit." });
      return;
    }

    if (typeof name !== "string") {
      res.status(400).json({ message: "Entrez un nom d'utilisateur valide" });
      return;
    }

    if (!name) {
      res.status(400).json({ message: "Le champ nom est nécessaire" });
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const checkAddPokemon = async (req, res, next) => {
  try {
    const { name, type } = req.body;
    const user = req.user;

    const pokedex = await Pokedex.findOne({ user: user._id });

    if (!pokedex) {
      res.status(400).json({ message: "Vous n'avez pas de pokedex." });
      return;
    }

    if (pokedex.pokemons.some((pokemon) => pokemon.name === name)) {
      res
        .status(400)
        .json({ message: "Ce pokemon est déjà dans votre pokedex." });
      return;
    }

    if (name === null || name === undefined) {
      res.status(400).json({ message: "Pokemon invalide" });
      return;
    }

    if (name?.length <= 0) {
      res.status(400).json({ message: "Pokemon invalide" });
      return;
    }

    if (name?.length < 2) {
      res.status(400).json({ message: "Pokemon invalide" });
      return;
    }

    if (name?.length >= 30) {
      res.status(400).json({ message: "Pokemon invalide" });
      return;
    }

    if (typeof name !== "string") {
      res.status(400).json({ message: "Pokemon invalide" });
      return;
    }

    if (typeof type !== "string") {
      res.status(400).json({ message: "Type invalide" });
      return;
    }

    if (type?.length < 2) {
      res.status(400).json({ message: "Type invalide" });
      return;
    }

    if (type?.length >= 30) {
      res.status(400).json({ message: "Type invalide" });
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { checkCreatePokedex, checkAddPokemon };
