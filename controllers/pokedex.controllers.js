const Pokedex = require("../models/pokedexSchema");

const createPokedexController = async (req, res) => {
  try {
    const user = req.user;
    const { name } = req.body;

    const newPokedex = new Pokedex();
    newPokedex.name = name;
    newPokedex.user = user._id;

    await newPokedex.save();

    res.status(200).json(newPokedex);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getPokedexController = async (req, res) => {
  try {
    const user = req.user;
    const pokedex = await Pokedex.findOne({ user: user._id });
    res.status(200).json(pokedex);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const addPokemonController = async (req, res) => {
  try {
    const user = req.user;
    const pokedex = await Pokedex.findOne({ user: user._id });
    const { name, type } = req.body;

    await pokedex.pokemons.push({ name, type });
    console.log(pokedex.pokemons);
    await pokedex.save();
    res.status(200).json(pokedex);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const deletePokemonController = async (req, res) => {
  try {
    const user = req.user;
    const pokedex = await Pokedex.findOne({ user: user._id });
    const { name } = req.body;

    const pokemon = pokedex.pokemons.find((pokemon) => pokemon.name === name);

    if (pokemon === null) {
      res.status(400).send("Pokemon non trouvé");
      return;
    }

    const index = pokedex.pokemons.indexOf(pokemon);
    pokedex.pokemons.splice(index, 1);
    await pokedex.save();
    res.status(200).json(pokedex);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const deletePokedexController = async (req, res) => {
  try {
    const user = req.user;
    const pokedex = await Pokedex.findOne({ user: user._id });
    if (!pokedex) {
      res.status(400).send("Vous n'avez pas de pokedex");
      return;
    }
    await pokedex.delete();
    res.status(200).send("Pokedex supprimé avec succès");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  createPokedexController,
  getPokedexController,
  addPokemonController,
  deletePokemonController,
  deletePokedexController,
};
