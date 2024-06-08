const Router = require("express");
const router = new Router();
const paragraphController = require("../controllers/paragraphControllers");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.post("/create",checkRoleMiddleware("Admin"), paragraphController.create);
router.get("/", paragraphController.getAll);
router.get("/coursParagraph/:courseId", paragraphController.getCoursParagraph);

router.delete("/deleteParagraph/:paragraphId",checkRoleMiddleware("Admin"), paragraphController.deleteParagraph);
router.post("/updateParagraph",checkRoleMiddleware("Admin"), paragraphController.updateParagraph);


module.exports = router;
