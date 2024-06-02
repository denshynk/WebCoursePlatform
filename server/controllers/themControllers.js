const { Theme, ThemText, Test, Question, Answer } = require("../models/models");
const ApiError = require("../error/ApiError");

class ThemeController {
	async create(req, res, next) {
		try {
			const { title, text, paragraphId, texts } = req.body;
			const theme = await Theme.create({
				title,
				description: text,
				paragraphId,
			});

			if (texts && texts.length > 0) {
				const createdTexts = await Promise.all(
					texts.map(async (textItem) => {
						const createdText = await ThemText.create({
							title: textItem.title,
							text: textItem.content,
							number: textItem.number,
							themeId: theme.id,
						});
						return createdText;
					})
				);
			}

			return res.json(theme);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}

	async getAll(req, res, next) {
		try {
			const themes = await Theme.findAll();
			return res.json(themes);
		} catch (e) {
			next(ApiError.internal("Internal Server Error"));
		}
	}

	async get(req, res, next) {
		try {
			const { id } = req.params;
			const theme = await Theme.findByPk(id);
			if (!theme) {
				return next(ApiError.notFound("Theme not found"));
			}
			return res.json(theme);
		} catch (e) {
			next(ApiError.internal("Internal Server Error"));
		}
	}

	async getParagraphThem(req, res, next) {
		try {
			const { paragraphId } = req.params;
			const themes = await Theme.findAll({
				where: { paragraphId },
				attributes: { exclude: ["createdAt", "updatedAt"] },
				include: {
					model: ThemText,
					attributes: { exclude: ["createdAt", "updatedAt"] },
				}, // Включаем модель ThemText для каждой темы
			});
			return res.json(themes);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}

	async updateTheme(req, res, next) {
		try {
			const { id, title, description } = req.body;
			const theme = await Theme.findOne({
				where: { id },
			});
			if (!theme) {
				return res.status(404).json({ message: "Theme not found" });
			}
			theme.title = title;
			theme.description = description;
			await theme.save();

			return res.json(theme);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}

	async updateText(req, res, next) {
		try {
			const { id, title, text, number, themeId } = req.body;
			if (!id) {
				const createdText = await ThemText.create({
					title: title,
					text: text,
					number: number,
					themeId: themeId,
				});
				return createdText;
			}

			const themText = await ThemText.findOne({
				where: { id },
			});
			themText.title = title;
			themText.text = text;
			if (themText.number != number) {
				themText.number = number;
			}
			await themText.save();
			return res.json(themText);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}

	async deleteText(req, res, next) {
		try {
			const { textId } = req.params;

			// Delete the paragraph and its associated data
			const deletedCount = await ThemText.destroy({
				where: { id: textId },
				include: [
					{
						model: Test,
						include: [{ model: Question, include: [Answer] }],
					},
				],
			});

			if (deletedCount === 0) {
				return res.status(404).json({ message: "Text not found" });
			}

			return res.json({
				message: "Text and associated data deleted successfully",
			});
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}

	async deleteTheme(req, res, next) {
		try {
			const { themeId } = req.params;

			// Delete the paragraph and its associated data
			const deletedCount = await Theme.destroy({
				where: { id: themeId },
				include: [
					{ model: ThemText },
					{
						model: Test,
						include: [{ model: Question, include: [Answer] }],
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
}

module.exports = new ThemeController();
