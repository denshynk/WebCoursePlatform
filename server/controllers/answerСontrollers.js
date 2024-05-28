const { Answer } = require("../models/models");
const ApiError = require("../error/ApiError");

class AnswerController {
	async create(req, res, next) {
		try {
			const { text, testId } = req.body;
			const answer = await Answer.create({ text, testId });
			return res.json(answer);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}
	async getAll(req, res) {
		const { testId } = req.body;
		let answers;
		if (testId) {
			answers = await Answer.findAll({ where: { testId } });
		}
		else {
			answers = await Answer.findAll()
		}
		return res.json(answers);
	}
	async getOne(req, res) {
		const { testId } = req.body;
		const answer = await Answer.findOne({ where: { testId } });
		return res.json(answer);
	}
}

module.exports = new AnswerController();
