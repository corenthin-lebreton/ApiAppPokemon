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
  controllers.getPokedexController
);

router.patch(
  "/api/addPokemon",
  middleware.isAuthentificated,
  dto.checkAddPokemon,
  controllers.addPokemonController
);

router.delete(
  "/api/deletePokemon",
  middleware.isAuthentificated,
  controllers.deletePokemonController
);

router.delete(
  "/api/deletePokedex",
  middleware.isAuthentificated,
  controllers.deletePokedexController
);

module.exports = router;
