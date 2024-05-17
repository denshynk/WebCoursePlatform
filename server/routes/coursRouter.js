const Router = require("express");
const router = new Router();
const coursController = require("../controllers/coursСontrollers");

router.post('/createCours', coursController.create)
router.get('/allCourses', coursController.getAll)
router.get("/cours/:id", coursController.get)

module.exports = router;
