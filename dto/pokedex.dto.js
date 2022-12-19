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
    const { name, id } = req.body;
    console.log("name " + name);
    console.log("id " + id);

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

module.exports = { checkCreatePokedex, checkAddPokemon, checkGetPokedex };
