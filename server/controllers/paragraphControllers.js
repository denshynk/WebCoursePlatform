const {
	Paragraph,
	Theme,
	Test,
	ThemText,
	Question,
	Answer,
} = require("../models/models");
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
	async getCoursParagraph(req, res, next) {
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
	async deleteParagraph(req, res, next) {
		try {
			const { paragraphId } = req.params;

			// Delete the paragraph and its associated data
			const deletedCount = await Paragraph.destroy({
				where: { id: paragraphId },
				include: [
					{
						model: Theme,
						include: [
							{ model: ThemText },
							{
								model: Test,
								include: [{ model: Question, include: [Answer] }],
							},
						],
					},
				],
			});

			if (deletedCount === 0) {
				return res.status(404).json({ message: "Paragraph not found" });
			}

			return res.json({
				message: "Paragraph and associated data deleted successfully",
			});
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}

	async updateParagraph(req, res, next) {
		try {
			const { id, text, title } = req.body;
			const paragraph = await Paragraph.findOne({
				where: { id },
			});

			if (!paragraph) {
				return res.status(404).json({ message: "Paragraph not found" });
			}

			paragraph.title = title;
			paragraph.text = text;
			await paragraph.save();

			return res.json(paragraph);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}
}
module.exports = new ParagraphController();
