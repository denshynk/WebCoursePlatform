const { Test } = require("../models/models");
const ApiError = require("../error/ApiError");
class TestController {
	async create(req, res, next) {
		try {
			const { title, choseAnswer, themeId } = req.body;
			const test = await Test.create({ title, choseAnswer, themeId });
			return res.json(test);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}
	async get(req, res) {}
	async getOne(req, res) {}
}

module.exports = new TestController();
