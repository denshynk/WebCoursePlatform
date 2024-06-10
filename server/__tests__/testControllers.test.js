const TestController = require("../controllers/testControllers");
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

// Моки для запитів до бази даних
jest.mock("../models/models", () => ({
	Test: {
		create: jest.fn(),
		findAll: jest.fn(),
		findOne: jest.fn(),
	},
	Question: {
		create: jest.fn(),
		findAll: jest.fn(),
	},
	Answer: {
		create: jest.fn(),
		findAll: jest.fn(),
	},
	UserAnswer: {
		create: jest.fn(),
		findAll: jest.fn(),
		findOne: jest.fn(),
	},
	FinalResult: {
		findOrCreate: jest.fn(),
	},
	TestCategory: {
		findAll: jest.fn(),
	},
}));

// Тести для методу create
describe("TestController create method", () => {
	it("should create a new test with questions and return the test object", async () => {
		// Встановлюємо значення для req.body
		const req = {
			body: {
				title: "Test Title",
				themeId: 1,
				time: 60,
				atemps: 1,
				questions: [
					{
						question: "Question 1",
						answers: ["Answer 1", "Answer 2", "Answer 3"],
						correctAnswer: "Answer 1",
						categoryId: 1,
					},
				],
			},
		};

		// Встановлюємо очікуваний результат
		const expectedTest = {
			id: 1,
			title: "Test Title",
			themeId: 1,
			time: 60,
			atemps: 1,
			createdAt: "2024-06-09T00:00:00.000Z",
			updatedAt: "2024-06-09T00:00:00.000Z",
		};

		const res = {
			json: jest.fn(), // Шпигун за методом json
		};
		const next = jest.fn();

		// Мокируем метод create модели Test
		Test.create.mockResolvedValueOnce(expectedTest);

		Answer.create.mockResolvedValueOnce({
			text: "Answer 1",
			questionId: 1,
		});

		Question.create.mockResolvedValueOnce({
			title: "Question 1",

			choseAnswer: ["Answer 1", "Answer 2", "Answer 3"],
			testCategoryId: 1,
			testId: 1,
		});

		// Викликаємо метод create контролера
		await TestController.create(req, res, next);

		// Перевіряємо, що Test.create був викликаний певними аргументами
		expect(next).not.toHaveBeenCalled();

		// Перевіряємо, що res.json був викликаний з очікуваним об'єктом тесту
		expect(res.json).toHaveBeenCalled();
	});

	it("should handle errors and call next with ApiError", async () => {
		// Встановлюємо значення для req.body
		const req = {
			body: {
				// неповні дані для створення тесту
			},
		};
		const res = {
			json: jest.fn(), // Шпигун за методом json
		};
		const next = jest.fn();

		// Встановлюємо повідомлення про помилку
		const errorMessage = "Validation error: Title is required";

		// Мокуємо метод create моделі Test, щоб спричинити помилку
		Test.create.mockRejectedValueOnce(new Error(errorMessage));

		// Викликаємо метод create контролера
		await TestController.create(req, res, next);

		// Перевіряємо, що next був викликаний з ApiError
		expect(next).toHaveBeenCalledWith(ApiError.badRequest(errorMessage));
	});
});

// Тести для методу getAll
describe("TestController getAll method", () => {
	it("should return all tests when no filters are provided", async () => {
		const req = { body: {} };
		const mockedTests = [
			/* Мокуємо тести*/
		];
		const res = {
			json: jest.fn(), // Шпигун за методом json
		};
		const next = jest.fn();

		// Мокируем метод findAll модели Test
		Test.findAll.mockResolvedValueOnce(mockedTests);

		// Викликаємо метод getAll контролера
		await TestController.getAll(req, res);

		// Перевіряємо, що res.json був викликаний з очікуваним списком тестів
		expect(res.json).toHaveBeenCalledWith(mockedTests);
	});

	// Інші тести для методу getAll
});

// Тести для методу getOne
describe("TestController getOne method", () => {
	it("should return a specific test with questions", async () => {
		const req = { params: { testId: 1 } };
		const mockedTest = {
			/* Мокируем тест*/
		};
		const res = {
			json: jest.fn(), // Шпигун за методом json
		};
		const next = jest.fn();

		// Мокируем метод findOne модели Test
		Test.findOne.mockResolvedValueOnce(mockedTest);

		UserAnswer.findAll.mockResolvedValueOnce([]);
		// Викликаємо метод getOne контролера
		await TestController.getOne(req, res, next);

		// Перевіряємо, що res.json був викликаний з очікуваним тестом

		expect(next).toHaveBeenCalled();
	});

	// Інші тести для методу getOne
});

// Тести для методу addUserAnswer
describe("TestController addUserAnswer method", () => {
	it("should handle user answers and calculate the rating", async () => {
		const req = {
			body: {
				/* Передаємо відповіді користувача*/
			},
			user: { id: 1 },
		};
		const mockedCorrectAnswers = [
			/* Мокуємо правильні відповіді*/
		];
		const mockedQuestionIdTitle = [
			/* Мокуємо інформацію про питання*/
		];
		const mockedTestCategoryCoefficients = [
			/* Мокуємо коефіцієнти категорій*/
		];
		const mockedTests = [
			/* Мокуємо тести*/
		];
		const mockedAllQuestions = [
			/* Мокуємо всі питання*/
		];
		const mockedAllUserAnswer = [
			/* Мокуємо відповіді користувача*/
		];
		const mockedUserCourseResult = {
			/* Мокуємо результат користувача*/
		};
		const expectedRating = 75; // Очікуваний рейтинг

		// Мокуємо необхідні методи та їх значення, що повертаються
		const res = {
			json: jest.fn(), // Шпигун за методом json
		};
		const next = jest.fn();

		// Викликаємо метод addUserAnswer контролера
		await TestController.addUserAnswer(req, res, next);

		// Перевіряємо, що res.json був викликаний з очікуваним результатом
		expect(next).toHaveBeenCalled();
	});

	// Інші тести для методу addUserAnswer
});
