const UserAnswerController = require("../controllers/userAnswerControllers");
const { UserAnswer, Test, User } = require("../models/models");
const ApiError = require("../error/ApiError");

// Моки для запитів до бази даних та об'єкта ApiError
jest.mock("../models/models", () => ({
	UserAnswer: {
		findAll: jest.fn(),
	},
	Test: {
		findAll: jest.fn(),
	},
	User: {
		findAll: jest.fn(),
	},
}));

jest.mock("../error/ApiError");

describe("UserAnswerController", () => {
	describe("get method", () => {
		

		it("should handle errors and return 500 status with error message", async () => {
			const req = {
				params: { id: 1 },
				user: { id: 1 },
			};

			const errorMessage = "Internal Server Error";
			UserAnswer.findAll.mockRejectedValueOnce(new Error(errorMessage));

			const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

			await UserAnswerController.get(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith(ApiError.internal(errorMessage));
		});
	});

	describe("getForAll method", () => {
		
		it("should handle errors and return 500 status with error message", async () => {
			const req = { params: { id: 1 } };

			const errorMessage = "Internal Server Error";
			UserAnswer.findAll.mockRejectedValueOnce(new Error(errorMessage));

			const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

			await UserAnswerController.getForAll(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith(ApiError.internal(errorMessage));
		});
	});
});
