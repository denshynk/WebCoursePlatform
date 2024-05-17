const Router = require("express");
const router = new Router();
const themController = require("../controllers/themControllers");


router.post("/", themController.create);
router.get("/", themController.get);

module.exports = router;
