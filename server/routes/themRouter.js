const Router = require("express");
const router = new Router();
const themController = require("../controllers/themControllers");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");


router.post("/create",checkRoleMiddleware("Admin"), themController.create);
router.get("/",checkRoleMiddleware("Admin"), themController.get);
router.delete("/delete/:themeId",checkRoleMiddleware("Admin"), themController.deleteTheme);

router.get("/paragraphTheme/:paragraphId", themController.getParagraphThem);
router.post("/updateTheme",checkRoleMiddleware("Admin"), themController.updateTheme);
router.post("/updateThemeText",checkRoleMiddleware("Admin"), themController.updateText);
router.delete("/theme_text/delete/:textId",checkRoleMiddleware("Admin"), themController.deleteText);


module.exports = router;
