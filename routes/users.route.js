const { Router } = require("express");
const dto = require("../dto/users.dto");
const controllers = require("../controllers/users.controllers");
const middleware = require("../middleware/auth.middleware");

const router = new Router();

router.post(
  "/api/register",
  dto.checkCreateUser,
  controllers.createUserController
);
router.post("/api/login", dto.checkLoginUser, controllers.loginUserController);

router.get(
  "/api/getCoin",
  middleware.isAuthentificated,
  controllers.getCoinControllers
);

router.patch(
  "/api/reduceCoin",
  middleware.isAuthentificated,
  dto.checkReduceCoin,
  controllers.reduceCoinControllers
);
router.patch(
  "/api/addCoin",
  middleware.isAuthentificated,
  controllers.addCoinControllers
);

//------------------------Creation of game------------------------

router.post(
  "/api/createRoom",
  middleware.isAuthentificated,
  controllers.createGameControllers
);

router.get(
  "/api/getRooms",
  middleware.isAuthentificated,
  controllers.getAllRoomController
);

router.post(
  "/api/joinRoom",
  middleware.isAuthentificated,
  controllers.joinRoomController
);

module.exports = router;
