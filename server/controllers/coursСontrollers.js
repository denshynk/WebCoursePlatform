const { Course, Paragraph, Theme, Test, ThemText} = require("../models/models");
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
			attributes: { exclude: ["createdAt", "updatedAt"] },
			include: [
				{
					model: Paragraph,
					attributes: { exclude: ["createdAt", "updatedAt"] },
					include: [
						{
							model: Theme,
							attributes: { exclude: ["createdAt", "updatedAt"] },
							include: [
								{
									model: Test,
									attributes: { exclude: ["createdAt", "updatedAt"] },
								},
								{
									model: ThemText, // Включаем модель ThemText
									attributes: { exclude: ["createdAt", "updatedAt"] },
								},
							],
						},
					],
				},
			],
		});
		console.log(course)
		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}
		return res.json(course);
	}
}

module.exports = new CoursController();
