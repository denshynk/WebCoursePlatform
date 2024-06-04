const Router = require("express");
const router = new Router();
const userCoursesController = require("../controllers/userCoursesContreollers");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/addtocourse", userCoursesController.addToCourse);

module.exports = router;
