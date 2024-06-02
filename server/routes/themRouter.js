const Router = require("express");
const router = new Router();
const themController = require("../controllers/themControllers");


router.post("/create", themController.create);
router.get("/", themController.get);
router.delete("/delete/:themeId", themController.deleteTheme);

router.get("/paragraphTheme/:paragraphId", themController.getParagraphThem);
// router.delete();
router.post("/updateTheme", themController.updateTheme);
router.post("/updateThemeText", themController.updateText);
router.delete("/theme_text/delete/:textId", themController.deleteText);


module.exports = router;
