const Router = require("express");
const router = new Router();
const preRegistrationControler = require("../controllers/preRegistrationControlers");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.post("/", preRegistrationControler.preRegistration);
router.get("/",checkRoleMiddleware("Admin"), preRegistrationControler.getAll);
router.post("/delete",checkRoleMiddleware("Admin"), preRegistrationControler.deletePreRegistrationUser);


module.exports = router;
