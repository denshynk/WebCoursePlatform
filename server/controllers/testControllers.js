const { Test, Question, Answer } = require("../models/models");
const ApiError = require("../error/ApiError");
class TestController {
	async create(req, res, next) {
		try {
			const { title, themeId, time, atemps, questions } = req.body;
			// Создание теста
			const test = await Test.create({
				title,
				themeId,
				atemps,
				time,
			});

			// Создание вопросов и ответов
			for (const questionData of questions) {
				const { question, answers, correctAnswer, categoryId } = questionData;

				// Создание вопроса
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
	async getOne(req, res) {
		const { id } = req.params;
		const test = await Test.findOne({
			where: { id },
		});
	}
}

module.exports = new TestController();
