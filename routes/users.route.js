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
router.post(
  "/api/login",
  middleware.isAuthentificated,
  dto.checkLoginUser,
  controllers.loginUserController
);
module.exports = router;
