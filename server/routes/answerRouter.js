const Router = require("express");
const router = new Router();
const answerController = require("../controllers/answerСontrollers");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.post("/",checkRoleMiddleware("Admin"),  answerController.create);
router.get("/",checkRoleMiddleware("Admin"),  answerController.getAll);

module.exports = router;
