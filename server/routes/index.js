const Router = require("express");
const router = new Router();
const answerRouter = require("./answerRouter");
const coursRouter = require("./coursRouter");

const paragraphRouter = require("./paragraphRouter");
const testRouter = require("./testRouter");
const themRouter = require("./themRouter");
const userRouter = require("./userRouter");
const preRegistration = require("./preRegistrationRouter");
const userAnswer = require("./userAnswerRouter");
const testcategory = require("./testCategoryRouter");
const userCourseRouter = require("./userCourseRouter");

router.use("/preregistration", preRegistration);
router.use("/user", userRouter);
router.use("/cours", coursRouter);
router.use("/paragraph", paragraphRouter);
router.use("/theme", themRouter);
router.use("/test", testRouter);
router.use("/userAnswer", userAnswer);
router.use("/answer", answerRouter);

router.use("/questionCategory", testcategory);
router.use("/userCourse", userCourseRouter);

module.exports = router;
