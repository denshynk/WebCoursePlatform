const Router = require("express");
const router = new Router();
const testController = require("../controllers/testControllers");

router.post("/", testController.create);
router.get("/", testController.getAll);
// router.get("/", testController.getOne);

module.exports = router;
