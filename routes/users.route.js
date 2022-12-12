const { Router } = require("express");
const dto = require("../dto/users.dto");
const controllers = require("../controllers/users.controllers");
const middleware = require("../middleware/auth.middleware");

const router = new Router();

router.post("/register", dto.checkCreateUser, controllers.createUserController);

router.get("/login", dto.checkLoginUser, controllers.loginUser);

router.patch(
  "/update",
  middleware.isAuthentificated,
  dto.checkPatchValue,
  controllers.patchUserController
);
router.delete(
  "/delete",
  middleware.isAuthentificated,
  controllers.deleteUserController
);

module.exports = router;
