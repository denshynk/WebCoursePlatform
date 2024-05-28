const Router = require("express");
const router = new Router();
const preRegistrationControler = require("../controllers/preRegistrationControlers");

router.post("/", preRegistrationControler.preRegistration);
router.get("/", preRegistrationControler.getAll);
router.post("/delete", preRegistrationControler.deletePreRegistrationUser);
// router.get("/", preRegistrationControler.getAll);

module.exports = router;
