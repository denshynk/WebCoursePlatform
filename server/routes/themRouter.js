const Router = require("express");
const router = new Router();
const themController = require("../controllers/themControllers");


router.post("/create", themController.create);
router.get("/", themController.get);
router.get("/paragraphTheme/:paragraphId", themController.getParagraphThem);

module.exports = router;
