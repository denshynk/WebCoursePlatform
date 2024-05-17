const { Course } = require('../models/models')
const ApiError = require('../error/ApiError')

class CoursController {
	async create(req, res) {
		const { title } = req.body
		const cours = await Course.create({ title })
		return res.json(cours)
	}
	async getAll(req, res) {
		const courses = await Course.findAll()
		return res.json(courses)
	}
	async get(req, res) {}
}

module.exports = new CoursController();
