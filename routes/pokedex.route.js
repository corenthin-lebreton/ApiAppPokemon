const { Router } = require("express");
const dto = require("../dto/pokedex.dto");
const controllers = require("../controllers/pokedex.controllers");
const middleware = require("../middleware/auth.middleware");

const router = new Router();

router.post(
  "/api/create",

  middleware.isAuthentificated,
  dto.checkCreatePokedex,
  controllers.createPokedexController
);

router.get(
  "/api/pokedex",
  middleware.isAuthentificated,
  dto.checkGetPokedex,
  controllers.getPokedexController
);

router.get(
  "/api/pokedextoadd",
  middleware.isAuthentificated,
  controllers.getPokedexToAddController
);

router.patch(
  "/api/addPokemon",
  middleware.isAuthentificated,
  dto.checkAddPokemon,
  controllers.addPokemonController
);

router.get("/api/getPokemonsFromPokedex", middleware.isAuthentificated);

module.exports = router;
