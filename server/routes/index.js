const Router = require('express')
const router = new Router()
const answerRouter = require('./answerRouter')
const coursRouter = require("./coursRouter");
const finalResultRouter = require("./finalResultRouter");
const paragraphRouter = require("./paragraphRouter");
const testRouter = require("./testRouter");
const themRouter = require("./themRouter");
const userRouter = require("./userRouter");
const preRegistration = require('./preRegistrationRouter')
const userAnswer = require('./userAnswerRouter')
const testcategory = require('./testCategoryRouter')



router.use("/preregistration", preRegistration);
router.use('/user', userRouter)
router.use("/cours", coursRouter);
router.use("/paragraph", paragraphRouter);
router.use("/theme", themRouter);
router.use("/test", testRouter);
router.use("/userAnswer", userAnswer);
router.use('/answer', answerRouter)
router.use('/finalResult', finalResultRouter)
router.use("/testcategory", testcategory);







module.exports = router