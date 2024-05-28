const { Test, Answer } = require("../models/models");
const ApiError = require("../error/ApiError");

class UserAnswerController {
	async create(req, res) {
		try {
			const { text, testId } = req.body;
			const answer = await Answer.create({ text, testId });
			return res.json(answer);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}
	async getAll(req, res) {}
}

module.exports = new UserAnswerController();
