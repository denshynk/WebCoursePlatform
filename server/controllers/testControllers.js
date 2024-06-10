const {
	Test,
	Question,
	Answer,
	UserAnswer,
	FinalResult,
	Theme,
	Paragraph,
	TestCategory,
} = require("../models/models");
const ApiError = require("../error/ApiError");
class TestController {
	async create(req, res, next) {
		try {
			const { title, themeId, time, atemps, questions, courseId } = req.body;
			// Створення тесту
			const test = await Test.create({
				title,
				themeId,
				atemps,
				time,
				courseId
			});

			// Створення питань та відповідей
			for (const questionData of questions) {
				const { question, answers, correctAnswer, categoryId } = questionData;

				// Створення питання
				const newQuestion = await Question.create({
					title: question,
					choseAnswer: answers,
					testCategoryId: categoryId,
					testId: test.id,
				});

				await Answer.create({
					text: correctAnswer,
					questionId: newQuestion.id,
				});
			}

			return res.json(test);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}
	async getAll(req, res) {
		const { paragraphId, themeId } = req.body;
		let test;
		if (!paragraphId & !themeId) {
			test = await Test.findAll();
		}
		if (paragraphId & !themeId) {
			test = await Test.findAll({ where: { paragraphId } });
		}
		if (!paragraphId & themeId) {
			test = await Test.findAll({ where: { themeId } });
		}
		if (paragraphId & themeId) {
			test = await Test.findAll({ where: { paragraphId, themeId } });
		}
		return res.json(test);
	}
	async getOne(req, res, next) {
		const { testId } = req.params;
		try {
			// Отримати тест із запитаннями
			const test = await Test.findOne({
				where: { id: testId },
				attributes: { exclude: ["createdAt", "updatedAt"] },
				include: [
					{
						model: Question,
						attributes: { exclude: ["createdAt", "updatedAt"] },
					},
				],
			});

			// Отримати кількість спроб користувача для цього тесту
			const userAtemps = await UserAnswer.findAll({
				where: { userId: req.user.id, testId: testId },
				attributes: ["atemp"],
			});

			// Знайти найбільшу кількість спроб користувача для цього тесту
			const hiestAtemp =
				userAtemps.length > 0
					? Math.max(...userAtemps.map((ans) => ans.atemp))
					: 0;

			// Додати кількість спроб у відповідь
			return res.json({ test, curentAtemps: hiestAtemp });
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}

	async addUserAnswer(req, res, next) {
		const answers = req.body;
		const { id } = req.user;

		try {
			// Отримати усі правильні відповіді з таблиці Answer на основі question IDs
			const correctAnswers = await Answer.findAll({
				attributes: ["questionId", "text"],
				where: {
					questionId: Object.keys(answers),
				},
			});

			// Отримати інформацію про питання
			const questionIdTitle = await Question.findAll({
				attributes: ["testId", "title", "id", "testCategoryId"],
				where: {
					id: Object.keys(answers),
				},
			});

			// Отримати кількість спроб для тесту
			const testAtemps = (
				await Test.findOne({
					attributes: ["atemps"],
					where: {
						id: questionIdTitle[0].testId,
					},
				})
			).atemps;

			const courseId = (
				await Test.findOne({
					where: { id: questionIdTitle[0].testId },
					attributes: { exclude: ["createdAt", "updatedAt"] },
					include: [
						{
							model: Theme,
							attributes: ["id"],
							include: [
								{
									model: Paragraph,
									attributes: ["courseId"],
								},
							],
						},
					],
				})
			).theme.paragraph.courseId;

			// Отримати кількість спроб користувача для цього тесту
			const userAtemps = await UserAnswer.findAll({
				where: { userId: req.user.id, testId: questionIdTitle[0].testId },
				attributes: ["atemp"],
			});

			// Обробка відповідей користувача
			const userAnswers = await Promise.all(
				Object.keys(answers).map(async (questionId) => {
					const userAnswer = answers[questionId];
					const correctAnswer = correctAnswers.find(
						(a) => a.questionId == questionId
					).text;
					const questionTitle = questionIdTitle.find(
						(q) => q.id == questionId
					).title;

					// Перевірка існуючої відповіді користувача
					const existingAnswer = await UserAnswer.findOne({
						where: {
							userId: id,
							questionId: parseInt(questionId),
						},
					});

					if (existingAnswer) {
						// Якщо відповідь існує, перевіряємо кількість спроб
						if (existingAnswer.atemp >= testAtemps) {
							return {
								error: `Ви досягли максимальної кількості спроб для питання ${questionTitle}`,
							};
						} else {
							// Оновлюємо існуючу відповідь, збільшуючи кількість спроб на 1
							await existingAnswer.update({
								userAnswers: userAnswer,
								IsCorect: userAnswer === correctAnswer,
								atemp: existingAnswer.atemp + 1,
							});
							return {
								message: `Відповідь на питання ${questionTitle} оновлено`,
								updated: true,
							};
						}
					} else {
						// Створюємо нову відповідь з atemp: 1
						await UserAnswer.create({
							userAnswers: userAnswer,
							questionTitle: questionTitle,
							IsCorect: userAnswer === correctAnswer,
							atemp: 1,
							testId: questionIdTitle[0].testId,
							userId: id,
							questionId: parseInt(questionId),
							courseId: courseId,
						});
						return {
							message: `Відповідь на питання ${questionTitle} додано`,
							created: true,
						};
					}
				})
			);

			// Перевірка на наявність помилок
			const errors = userAnswers.filter((answer) => answer.error);
			if (errors.length > 0) {
				return res.status(400).json({ errors });
			}

			// Отримати коефіцієнти для категорій
			const categoryCoefficients = await TestCategory.findAll({
				attributes: ["id", "coefficient"],
			});
			// Обчислення рейтингу
			let totalScore = 0;
			let maxScore = 0;
			const tests = await Test.findAll({
				where: { courseId: courseId },
				include: [{ model: Question, attributes: ["id", "testCategoryId"] }],
			});


			const allQuestions = [];
			tests.forEach((test) => {
				test.questions.forEach((question) => {
					allQuestions.push(question);
				});
			});
			const allUserAnswer = await UserAnswer.findAll({
				where: { userId: id, courseId: courseId },
			});

			allUserAnswer.forEach(async (userAnswer) => {
				if (userAnswer.IsCorect) {
					const question = allQuestions.find(
						(q) => q.id === userAnswer.questionId
					);
					if (question) {
						const testCategoryId = question.testCategoryId;

						const koefic = categoryCoefficients.find(
							(koef) => koef.id === testCategoryId
						);
						if (koefic) {
							totalScore += koefic.coefficient;
						}
					}
				}
			});

			allQuestions.forEach(async (question) => {
				const testCategoryId = question.testCategoryId;
				const koefic = categoryCoefficients.find(
					(koef) => koef.id === testCategoryId
				);
				if (koefic) {
					maxScore += koefic.coefficient;
					
				}
			});
			console.log(totalScore);
			console.log(maxScore);

			const rating = (totalScore / maxScore) * 100;

			// Оновити або створити запис у таблиці FinalResult
			const [userCourseResult, created] = await FinalResult.findOrCreate({
				where: {
					userId: id,
					courseId: parseInt(courseId),
				},
				defaults: {
					result: rating,
				},
			});

			if (!created) {
				await userCourseResult.update({ result: rating });
			}

			res.json({
				message: "Answers submitted successfully",
				userAnswers,
				rating,
			});
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}
}

module.exports = new TestController();
