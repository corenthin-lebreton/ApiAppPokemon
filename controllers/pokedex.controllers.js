const Pokedex = require("../models/pokedexSchema");

const createPokedexController = async (req, res) => {
  try {
    const user = req.user;

    const newPokedex = new Pokedex();
    newPokedex.user = user._id;

    await newPokedex.save();

    res.status(200).json(newPokedex);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getPokedexController = async (req, res) => {
  try {
    const user = req.user;
    const pokedex = await Pokedex.findOne({ user: user._id });
    res.status(200).json(pokedex);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getPokedexToAddController = async (req, res) => {
  try {
    const user = req.user;
    const pokedex = await Pokedex.findOne({ user: user._id });
    res.status(200).json(pokedex);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const addPokemonController = async (req, res) => {
  try {
    const user = req.user;
    const pokedex = await Pokedex.findOne({ user: user._id });
    const { name, id } = req.body;
    console.log("name " + name);
    console.log("id " + id);

    await pokedex.pokemons.push({ name, id });
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

    const index = pokedex.pokemons.indexOf(pokemon);
    pokedex.pokemons.splice(index, 1);

    await pokedex.save();
    res.status(200).json(pokedex);

    if (pokemon === null) {
      res.status(400).send("Pokemon non trouvé");
      return;
    }
    res.status(200).json(pokedex);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  createPokedexController,
  getPokedexController,
  addPokemonController,
  deletePokemonController,
  getPokedexToAddController,
};
