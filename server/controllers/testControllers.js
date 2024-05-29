const { Test, Question, Answer } = require("../models/models");
const ApiError = require("../error/ApiError");
class TestController {
	 async create(req, res, next) {
		const transaction = await sequelize.transaction(); // Start a transaction
		try {
			const { title, themeId, categoryId, questions } = req.body;
			const test = await Test.create(
				{
					title,
					themeId,
					testCategoryId: categoryId,
				},
			);

			for (const questionData of questions) {
				const { question, answers, correctAnswer } = questionData;

				// Create question
				const newQuestion = await Question.create(
					{
						question,
						answers,
						testId: test.id,
					},
					{ transaction }
				);

				await Answer.create(
					{
						correctAnswer,
						questionId: newQuestion.id,
					},
					{ transaction }
				);
			}

			await transaction.commit(); // Commit the transaction
			return res.json(test);
		} catch (e) {
			await transaction.rollback(); // Rollback the transaction
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
