const { UserAnswer, Test, User } = require("../models/models");
const ApiError = require("../error/ApiError");

class UserAnswerController {
    async get(req, res) {
        const { id } = req.params; // id курса
        const userId = req.user.id;

        try {
            // Получаем все ответы пользователя для конкретного курса
            const userAnswers = await UserAnswer.findAll({
                where: { userId: userId, courseId: parseInt(id) },
                raw: true
            });

            // Группируем данные по testId и подсчитываем результаты
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

            // Получаем testIds и преобразуем их в числовые значения
            const testIds = Object.keys(testResultsMap).map(id => parseInt(id));


            // Получаем названия тестов по testId
            const tests = await Test.findAll({
                where: { id: testIds },
                attributes: ['id', 'title'],
                raw: true
            });

			

            // Объединяем результаты и названия тестов
            const testResults = tests.map(test => ({
				
                testId: test.id,
                testName: test.title,
                correctAnswersCount: testResultsMap[test.id].correctAnswersCount,
                totalQuestionsCount: testResultsMap[test.id].totalQuestionsCount
            }));

            // Возвращаем результаты
            return res.json(testResults);
        } catch (e) {
            return res.status(500).json(ApiError.internal('Ошибка сервера'));
        }
    }
	async getForAll(req, res) {
        const { id } = req.params; // id курса
        try {
            // Получаем все ответы пользователей для конкретного курса
            const userAnswers = await UserAnswer.findAll({
                where: { courseId: parseInt(id) },
                raw: true
            });

            // Группируем данные по testId и userId и подсчитываем результаты
            const testResultsMap = userAnswers.reduce((acc, answer) => {
                const { testId, userId, IsCorect } = answer;

                if (!acc[testId]) {
                    acc[testId] = {};
                }

                if (!acc[testId][userId]) {
                    acc[testId][userId] = { correctAnswersCount: 0, totalQuestionsCount: 0 };
                }

                acc[testId][userId].totalQuestionsCount++;
                if (IsCorect) {
                    acc[testId][userId].correctAnswersCount++;
                }

                return acc;
            }, {});

            // Получаем testIds и userIds
            const testIds = Object.keys(testResultsMap).filter(id => id !== 'undefined').map(id => parseInt(id));
            const userIds = [...new Set(userAnswers.map(answer => answer.userId))];

            if (testIds.length === 0 || userIds.length === 0) {
                return res.status(404).json({ message: "No test or user data found" });
            }

            // Получаем названия тестов по testId
            const tests = await Test.findAll({
                where: { id: testIds },
                attributes: ['id', 'title'],
                raw: true
            });


            // Получаем информацию о студентах по userId
            const users = await User.findAll({
                where: { id: userIds },
                attributes: ['id', 'name', 'surname', 'group'],
                raw: true
            });

            // Создаем маппинг для быстрых поисков названий тестов и информации о студентах
            const testMap = tests.reduce((acc, test) => {
                acc[test.id] = test.title;
                return acc;
            }, {});

            const userMap = users.reduce((acc, user) => {
                acc[user.id] = user;
                return acc;
            }, {});

            // Формируем окончательные результаты
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
                        totalQuestionsCount: result.totalQuestionsCount
                    });
                }
            }

            // Возвращаем результаты
            return res.json(testResults);
        } catch (e) {
            return res.status(500).json(ApiError.internal('Ошибка сервера'));
        }
    }
}

module.exports = new UserAnswerController();
