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
			const userId = req.user.id; // Предполагаем, что ID пользователя доступен в req.user.id
	
			const userCourses = await UserCourse.findAll({
				where: { userId: userId },
				include: [
					{
						model: BasketUserCourse,
						attributes: { exclude: ["createdAt", "updatedAt"] },
						include: [
							{
								model: Course, // Предполагаем, что модель Course связана с UserCourse
								attributes: { exclude: ["createdAt", "updatedAt"] },
							},
						],
					},
				],
				attributes: { exclude: ["createdAt", "updatedAt"] },
			});
	
			// Получение списка курсов
			const courses = userCourses.flatMap((userCourse) =>
				userCourse.basket_user_courses.map((basketUserCourse) => basketUserCourse.course)
			);
	
			// Получение результатов для курсов
			const courseIds = courses.map(course => course.id);
			const finalResults = await FinalResult.findAll({
				where: {
					userId: userId,
					courseId: courseIds,
				},
				attributes: { exclude: ["createdAt", "updatedAt"] },
			});
	
			// Создание словаря для быстрого доступа к результатам
			const finalResultsMap = finalResults.reduce((acc, result) => {
				acc[result.courseId] = result.result;
				return acc;
			}, {});
	
			// Формирование ответа
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
									model: ThemText, // Включаем модель ThemText
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
