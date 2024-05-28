const Router = require("express");
const router = new Router();
const userAnswerController = require("../controllers/userAnswerControllers");

router.post("/new", userAnswerController.create);
router.get("/", userAnswerController.getAll);

module.exports = router;
