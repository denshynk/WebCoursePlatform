const Router = require("express");
const router = new Router();
const userCoursesController = require("../controllers/userCoursesContreollers");
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.post("/addtocourse",checkRoleMiddleware("Admin"), userCoursesController.addToCourse);

module.exports = router;
