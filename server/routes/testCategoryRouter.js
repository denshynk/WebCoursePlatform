const Router = require("express");
const router = new Router();
const testCategoryController = require("../controllers/testCategoryControllers");


router.get("/", testCategoryController.getAll);


module.exports = router;
