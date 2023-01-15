const Pokedex = require("../models/pokedexSchema");
const ArrayForFight = require("../models/arrayForFight.js");

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
    const { id } = req.body;
    await pokedex.pokemons.push(id);
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

    const { id } = req.body;

    const pokemon = pokedex.pokemons.find((pokemon) => pokemon.id === id);

    if (!pokemon) {
      res.status(400).send("Pokemon non trouvé");
      return;
    }

    const index = pokedex.pokemons.indexOf(pokemon);
    pokedex.pokemons.splice(index, 1);

    await pokedex.save();
    res.status(200).json(pokedex);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//Pokebattle ---------------------------------------------

const AddPokemonForFightController = async (req, res) => {
  try {
    const user = req.user;
    const { pokemonsForFight } = req.body;

    const pokedex = await Pokedex.findOne({ user: user._id });

    if (!pokemonsForFight.every((e) => pokedex.pokemons.includes(e))) {
      res.status(400).send("Pokemon non trouvé");
      return;
    } else {
      const arrayFight = new ArrayForFight();

      arrayFight.user = user._id;
      arrayFight.pokemonsForFight = pokemonsForFight;

      await arrayFight.save();
      res.status(200).json(arrayFight);
    }
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
  getPokedexToAddController,
  AddPokemonForFightController,
};
