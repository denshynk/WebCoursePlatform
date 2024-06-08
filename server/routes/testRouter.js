const Router = require("express");
const router = new Router();
const testController = require("../controllers/testControllers");
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");


router.post("/create",checkRoleMiddleware("Admin"), testController.create);
router.get("/",checkRoleMiddleware("Admin"), testController.getAll);
router.get("/selected/:testId",authMiddleware, testController.getOne);
router.post('/userAnswer',authMiddleware, testController.addUserAnswer )

module.exports = router;
