const { Theme, ThemText } = require("../models/models");
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

	async getParagraphThem(req, res) {
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
}

module.exports = new ThemeController();
