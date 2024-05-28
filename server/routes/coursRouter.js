const Router = require("express");
const router = new Router();
const coursController = require("../controllers/coursСontrollers");
const checkRole = require("../middleware/checkRoleMiddleware");


router.post('/createCours',checkRole("Admin"), coursController.create)
router.get('/allCourses', coursController.getAll)
router.get("/:id", coursController.get)

module.exports = router;
