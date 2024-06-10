const {
	Course,
	Paragraph,
	Theme,
	Test,
	ThemText,
	BasketUserCourse,
	FinalResult,
	UserCourse,
} = require("../models/models");
const ApiError = require("../error/ApiError");
const { where } = require("sequelize");

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
	async getAllMyCourses(req, res) {
		try {
			const userId = req.user.id; // Припускаємо, що ID користувача доступний у req.user.id
	
			const userCourses = await UserCourse.findAll({
				where: { userId: userId },
				include: [
					{
						model: BasketUserCourse,
						attributes: { exclude: ["createdAt", "updatedAt"] },
						include: [
							{
								model: Course, // Припускаємо, що модель Course пов'язана з UserCourse
								attributes: { exclude: ["createdAt", "updatedAt"] },
							},
						],
					},
				],
				attributes: { exclude: ["createdAt", "updatedAt"] },
			});
	
			// Отримання списку курсів
			const courses = userCourses.flatMap((userCourse) =>
				userCourse.basket_user_courses.map((basketUserCourse) => basketUserCourse.course)
			);
	
			// Отримання результатів для курсів
			const courseIds = courses.map(course => course.id);
			const finalResults = await FinalResult.findAll({
				where: {
					userId: userId,
					courseId: courseIds,
				},
				attributes: { exclude: ["createdAt", "updatedAt"] },
			});
	
			// Створення словника для швидкого доступу до результатів
			const finalResultsMap = finalResults.reduce((acc, result) => {
				acc[result.courseId] = result.result;
				return acc;
			}, {});
	
			// Формування відповіді
			const newCourses = courses.map((course) => ({
				id: course.id,
				title: course.title,
				result: finalResultsMap[course.id] ? parseInt(finalResultsMap[course.id]) : null,
			}));
	
	
	
			return res.json(newCourses);
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	}
	
	async getOne(req, res) {
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
									model: ThemText, // Включаємо модель ThemText
									attributes: { exclude: ["createdAt", "updatedAt"] },
								},
							],
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
