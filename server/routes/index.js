const Router = require('express')
const router = new Router()
const answerRouter = require('./answerRouter')
const coursRouter = require("./coursRouter");
const finalResultRouter = require("./finalResultRouter");
const paragraphRouter = require("./paragraphRouter");
const questionRouter = require("./questionRouter");
const ratingRouter = require("./ratingRouter");
const testRouter = require("./testRouter");
const themRouter = require("./themRouter");
const userRouter = require("./userRouter");


router.use('/user', userRouter)
router.use('/answer', answerRouter)
router.use('/cours',coursRouter)
router.use('/finalResult', finalResultRouter)
router.use('/paragraph',paragraphRouter)
router.use('/question',questionRouter)
router.use("/rating", ratingRouter);
router.use('/test',testRouter)
router.use('/theme',themRouter)



module.exports = router