const Router = require("express");
const router = new Router();
const paragraphController = require("../controllers/paragraphControllers");

router.post("/create", paragraphController.create);
router.get("/", paragraphController.getAll);
router.get(
	"/coursParagraph/:courseId",
	paragraphController.getCoursParagraph
);

module.exports = router;
