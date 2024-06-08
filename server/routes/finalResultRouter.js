const Router = require("express");
const router = new Router();
const finalResultController = require("../controllers/finalResultСontrollers");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");


router.get("/",checkRoleMiddleware("Admin"));

module.exports = router;
