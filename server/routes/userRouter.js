const Router = require("express");
const router = new Router();
const userController = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.post("/registration",checkRoleMiddleware("Admin"), userController.registration);
router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);
router.get("/getAllUsers",checkRoleMiddleware("Admin"), userController.getAllUsers);

module.exports = router;
