const Router = require("express");
const router = new Router();
const answerController = require("../controllers/answerСontrollers");

router.post("/", answerController.create);
router.get("/", answerController.getOne);

module.exports = router;
