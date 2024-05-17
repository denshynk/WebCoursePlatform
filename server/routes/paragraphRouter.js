const Router = require("express");
const router = new Router();
const paragraphController = require("../controllers/paragraphControllers");

router.post("/", paragraphController.create);
router.get("/", paragraphController.get);
router.get("/", paragraphController.getAll);

module.exports = router;
