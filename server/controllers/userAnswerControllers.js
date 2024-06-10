const {
	UserAnswer,
	Test,
	User,
	TestCategory,
	Question,
} = require("../models/models");
const ApiError = require("../error/ApiError");

class UserAnswerController {
	async get(req, res) {
		const { id } = req.params; // id курсу
		const userId = req.user.id;

		try {
			// Отримуємо всі відповіді користувача для конкретного курсу
			const userAnswers = await UserAnswer.findAll({
				where: { userId: userId, courseId: parseInt(id) },
				attributes: { exclude: ["createdAt", "updatedAt"] },
				raw: true,
			});

			const allTestId = await Test.findAll({
				where: { courseId: parseInt(id) },
				attributes: ["id"],
				raw: true,
			});

			const allTestIdOne = allTestId.map((test) => test.id);

			const allQuestions = await Question.findAll({
				where: { testId: allTestIdOne },
				attributes: ["id", "testCategoryId"],
				raw: true,
			});

			const testCaregory = await TestCategory.findAll({
				attributes: { exclude: ["createdAt", "updatedAt"] },
				raw: true,
			});


			// Ініціалізувати об’єкти questionsData та correctAnswersData
			const questionsData = {};
			const correctAnswersData = {};

			// Перегляд категорій тестів
			testCaregory.forEach((category) => {
				// Ініціалізувати лічильники запитань і правильних відповідей
				let totalQuestions = 0;
				let correctAnswers = 0;

				// Фільтрувати запитання, пов’язані з поточною категорією
				const categoryQuestions = allQuestions.filter(
					(question) => question.testCategoryId === category.id
				);

				// Обчисліть загальну кількість питань для категорії
				totalQuestions = categoryQuestions.length;

				// Перевірте, чи є запитання
				if (totalQuestions > 0) {
					// Повторюйте запитання, щоб знайти кількість правильних відповідей
					categoryQuestions.forEach((question) => {
						const answeredQuestion = userAnswers.find(
							(answer) => answer.questionId === question.id
						);
						if (answeredQuestion && answeredQuestion.IsCorect) {
							correctAnswers++; // Збільшити кількість правильних відповідей для категорії
						}
					});
				}

				// Додайте дані до questionsData та correctAnswersData
				questionsData[category.CategoryName] = totalQuestions;
				correctAnswersData[category.CategoryName] = correctAnswers;
			});

			// Зареєструйте згенеровані дані для перевірки
			console.log(questionsData);
			console.log(correctAnswersData);

			// Групуємо дані з testId і підраховуємо результати
			const testResultsMap = userAnswers.reduce((acc, answer) => {
				const { testId, IsCorect } = answer;

				if (!acc[testId]) {
					acc[testId] = { correctAnswersCount: 0, totalQuestionsCount: 0 };
				}

				acc[testId].totalQuestionsCount++;
				if (IsCorect) {
					acc[testId].correctAnswersCount++;
				}

				return acc;
			}, {});

			// Отримуємо testIds і перетворимо їх на числові значення
			const testIds = Object.keys(testResultsMap).map((id) => parseInt(id));

			// Отримуємо назви тестів testId
			const tests = await Test.findAll({
				where: { id: testIds },
				attributes: ["id", "title"],
				raw: true,
			});

			// Об'єднуємо результати та назви тестів
			const testResults = tests.map((test) => ({
				testId: test.id,
				testName: test.title,
				correctAnswersCount: testResultsMap[test.id].correctAnswersCount,
				totalQuestionsCount: testResultsMap[test.id].totalQuestionsCount,
			}));

			// Повертаємо результати
			return res.json({testResults, questionsData, correctAnswersData});
		} catch (e) {
			return res.status(500).json(ApiError.internal("Помилка сервера"));
		}
	}
	async getForAll(req, res) {
		const { id } = req.params; // id курсу
		try {
			// Отримуємо всі відповіді користувачів для конкретного курсу
			const userAnswers = await UserAnswer.findAll({
				where: { courseId: parseInt(id) },
				raw: true,
			});

			// Групуємо дані з testId і userId і підраховуємо результати
			const testResultsMap = userAnswers.reduce((acc, answer) => {
				const { testId, userId, IsCorect } = answer;

				if (!acc[testId]) {
					acc[testId] = {};
				}

				if (!acc[testId][userId]) {
					acc[testId][userId] = {
						correctAnswersCount: 0,
						totalQuestionsCount: 0,
					};
				}

				acc[testId][userId].totalQuestionsCount++;
				if (IsCorect) {
					acc[testId][userId].correctAnswersCount++;
				}

				return acc;
			}, {});

			// Отримуємо testIds та userIds
			const testIds = Object.keys(testResultsMap)
				.filter((id) => id !== "undefined")
				.map((id) => parseInt(id));
			const userIds = [...new Set(userAnswers.map((answer) => answer.userId))];

			if (testIds.length === 0 || userIds.length === 0) {
				return res.status(404).json({ message: "No test or user data found" });
			}

			// Отримуємо назви тестів testId
			const tests = await Test.findAll({
				where: { id: testIds },
				attributes: ["id", "title"],
				raw: true,
			});

			// Отримуємо інформацію про студентів з userId
			const users = await User.findAll({
				where: { id: userIds },
				attributes: ["id", "name", "surname", "group"],
				raw: true,
			});

			// Створюємо мапінг для швидких пошуків назв тестів та інформації про студентів
			const testMap = tests.reduce((acc, test) => {
				acc[test.id] = test.title;
				return acc;
			}, {});

			const userMap = users.reduce((acc, user) => {
				acc[user.id] = user;
				return acc;
			}, {});

			// Формуємо остаточні результати
			const testResults = [];
			for (const [testId, userResults] of Object.entries(testResultsMap)) {
				for (const [userId, result] of Object.entries(userResults)) {
					testResults.push({
						testId: parseInt(testId),
						testName: testMap[testId],
						studentName: userMap[userId].name,
						studentSurname: userMap[userId].surname,
						studentGroup: userMap[userId].group,
						correctAnswersCount: result.correctAnswersCount,
						totalQuestionsCount: result.totalQuestionsCount,
					});
				}
			}

			// Повертаємо результати
			return res.json(testResults);
		} catch (e) {
			return res.status(500).json(ApiError.internal("Помилка сервера"));
		}
	}
}

module.exports = new UserAnswerController();
