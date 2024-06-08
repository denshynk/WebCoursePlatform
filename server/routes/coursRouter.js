const Router = require("express");
const router = new Router();
const coursController = require("../controllers/coursСontrollers");
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");


router.post('/createCours',checkRole("Admin"), coursController.create)
router.get('/allCourses',checkRole("Admin"),  coursController.getAll)
router.get('/my-courses',authMiddleware, coursController.getAllMyCourses)
router.get("/:id", coursController.getOne)


module.exports = router;
