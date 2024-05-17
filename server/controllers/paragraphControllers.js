const { Paragraph } = require("../models/models");
const ApiError = require("../error/ApiError");

class ParagraphController {
	async create(req, res, next) {
		try {
			const { title, courseId } = req.body;
			const paragraph = await Paragraph.create({ title, courseId });
			return res.json(paragraph);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}
	async getAll(req, res) {}
	async get(req, res) {}
}

module.exports = new ParagraphController();
