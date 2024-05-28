const { Test } = require("../models/models");
const ApiError = require("../error/ApiError");
class TestController {
	async create(req, res, next) {
		try {
			const { title, choseAnswer, themeId, paragraphId } = req.body;
			const test = await Test.create({
				title,
				choseAnswer,
				themeId,
				paragraphId,
			});
			return res.json(test);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}
	async getAll(req, res) {
		const { paragraphId, themeId } = req.body;
		let test;
		if (!paragraphId & !themeId) {
			test = await Test.findAll();
		}
		if (paragraphId & !themeId) {
			test = await Test.findAll({ where: { paragraphId } });
		}
		if (!paragraphId & themeId) {
			test = await Test.findAll({ where: { themeId } });
		}
		if (paragraphId & themeId) {
			test = await Test.findAll({ where: { paragraphId, themeId } });
		}
		return res.json(test);
	}
	async getOne(req, res) {
		const { id } = req.params
		const test = await Test.findOne(
			{
				where: { id }
				
			}
		)
	} 
}

module.exports = new TestController();
