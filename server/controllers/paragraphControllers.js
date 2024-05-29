const { Paragraph } = require("../models/models");
const ApiError = require("../error/ApiError");

class ParagraphController {
	async create(req, res, next) {
		try {
			const { title, text, courseId } = req.body;
			const paragraph = await Paragraph.create({ title, text, courseId });
			return res.json(paragraph);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}
	async getAll(req, res) {
		const paragraph = await Paragraph.findAll();
		return res.json(paragraph);
	}
	async getCoursParagraph(req, res) {
		try {
			const { courseId } = req.params;
			const paragraphs = await Paragraph.findAll({
				where: { courseId },
				attributes: { exclude: ["createdAt", "updatedAt"] },
			});
			return res.json(paragraphs);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}
}

module.exports = new ParagraphController();
