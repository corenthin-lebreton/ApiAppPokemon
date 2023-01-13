const Pokedex = require("../models/pokedexSchema");

const checkCreatePokedex = async (req, res, next) => {
  try {
    const user = req.user;

    const pokedex = await Pokedex.findOne({ user: user._id });
    if (pokedex) {
      res.status(400).json({ message: "Vous avez déjà un pokedex." });
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
    const { id } = req.body;

    const user = req.user;

    const pokedex = await Pokedex.findOne({ user: user._id });

    if (!pokedex) {
      res.status(400).json({ message: "Vous n'avez pas de pokedex." });
      return;
    }

    if (id === null || id === undefined) {
      res.status(400).json({ message: "Pokemon invalide" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const checkGetPokedex = async (req, res, next) => {
  try {
    const user = req.user;

    const pokedex = await Pokedex.findOne({ user: user._id });

    if (!pokedex) {
      res.status(400).json({
        message:
          "Vous n'avez pas de pokedex. Ajoutez un pokemon pour en créer un",
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const checkAddPokemonForFight = (req, res, next) => {
  const { id } = req.body;

  if (!Array.isArray(id)) {
    res.status(400).json({ message: "Vous devez envoyer un tableau d'id" });
    return;
  } else {
    if (id.every((e) => typeof e !== "number")) {
      res.status(400).json({ message: "type d'envoi incorrect" });
      return;
    } else {
      if (id.length !== 6) {
        res.status(400).json({ message: "Vous devez envoyer 6 pokemons" });
        return;
      } else {
        next();
      }
    }
  }
};

module.exports = {
  checkCreatePokedex,
  checkAddPokemon,
  checkGetPokedex,
  checkAddPokemonForFight,
};
