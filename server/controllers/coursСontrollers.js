const { Course, Paragraph, Theme, Test } = require("../models/models");
const ApiError = require("../error/ApiError");

class CoursController {
	async create(req, res) {
		const { title } = req.body;
		const cours = await Course.create({ title });
		return res.json(cours);
	}
	async getAll(req, res) {
		const courses = await Course.findAll();
		return res.json(courses);
	}
	async get(req, res) {
		const { id } = req.params;
		const course = await Course.findOne({
			where: { id },
			include: [
				{
					model: Paragraph,
					include: [
						{
							model: Theme,
							include: [Test],
						},
					],
				},
			],
		});
		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}
		return res.json(course);
	}
}

module.exports = new CoursController();
