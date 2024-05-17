const { Theme } = require("../models/models");
const ApiError = require("../error/ApiError");

class ThemController {
	async create(req, res, next) {
		try {
			const { title, description, paragraphId } = req.body;
			const theme = await Theme.create({ title, description, paragraphId });
			return res.json(theme);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}
	async getAll(req, res) {}
	async get(req, res) {}
}

module.exports = new ThemController();
