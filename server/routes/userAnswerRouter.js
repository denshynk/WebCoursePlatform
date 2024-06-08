const Router = require("express");
const router = new Router();
const userAnswerController = require("../controllers/userAnswerControllers");
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.get("/courseTest/:id",authMiddleware, userAnswerController.get);
router.get("/courseTest/forAllStudent/:id", checkRoleMiddleware("Admin"), userAnswerController.getForAll);



module.exports = router;
