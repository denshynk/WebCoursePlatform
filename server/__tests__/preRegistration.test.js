const request = require("supertest");
const express = require("express");
const app = express("../index");
const PreRegistrationControler = require("../controllers/preRegistrationControlers");
const ApiError = require("../error/ApiError");
const { PreRegistration } = require("../models/models");
require("dotenv").config();

jest.mock("../models/models");

describe("PreRegistrationControler", () => {
	describe("preRegistration", () => {
		// Тесты для метода preRegistration
		it("should return token if registration is successful", async () => {
			// Змішане тіло запиту
			const req = {
				body: {
					email: "test@example.com",
					password: "password",
					name: "Test",
					surname: "User",
					group: "TestGroup",
				},
			};
			// Висміяний об’єкт відповіді
			const res = { json: jest.fn() };
			const next = jest.fn();

			// Підробити PreRegistration.findOne, щоб повернути значення null, що вказує на відсутність користувача з указаною електронною поштою
			PreRegistration.findOne.mockResolvedValueOnce(null);
			// Mock PreRegistration.create для повернення об’єкта користувача
			PreRegistration.create.mockResolvedValueOnce({
				id: 1,
				email: "test@example.com",
				role: "user",
			});

			await PreRegistrationControler.preRegistration(req, res, next);

			expect(res.json).toHaveBeenCalled();
			expect(next).not.toHaveBeenCalled();
		});

		it("should return ApiError if email is already registered", async () => {
			// Змішане тіло запиту
			const req = {
				body: {
					email: "test@example.com",
					password: "password",
					name: "Test",
					surname: "User",
					group: "TestGroup",
				},
			};
			// Висміяний об’єкт відповіді
			const res = { json: jest.fn() };
			const next = jest.fn();

			// Mock PreRegistration.findOne для повернення об’єкта користувача, який вказує на те, що електронна адреса вже зареєстрована
			PreRegistration.findOne.mockResolvedValueOnce({
				id: 1,
				email: "test@example.com",
				role: "user",
			});

			await PreRegistrationControler.preRegistration(req, res, next);

			expect(next).toHaveBeenCalledWith(
				ApiError.badRequest("Пользоваетель с такми email уже существует")
			);
			expect(res.json).not.toHaveBeenCalled();
		});

		// Інші тести для методу preRegistration
	});

	describe("getAll", () => {
		// Тести для методу getAll
		it("should return all pre-registered users", async () => {
			// Висміяний об’єкт відповіді
			const res = { json: jest.fn() };
			const next = jest.fn();

			// Mock PreRegistration.findAll для повернення масиву попередньо зареєстрованих користувачів
			const preUsers = [
				{
					id: 1,
					email: "user1@example.com",
					name: "User 1",
					surname: "Surname 1",
					group: "Group 1",
				},
				{
					id: 2,
					email: "user2@example.com",
					name: "User 2",
					surname: "Surname 2",
					group: "Group 2",
				},
			];
			PreRegistration.findAll.mockResolvedValueOnce(preUsers);

			await PreRegistrationControler.getAll({}, res, next);

			expect(res.json).toHaveBeenCalledWith(preUsers);
			expect(next).not.toHaveBeenCalled();
		});

		it("should call next with ApiError if there is an error in retrieving pre-registered users", async () => {
			// Висміяний об’єкт відповіді
			const res = { json: jest.fn() };
			const next = jest.fn();
			// Підробити PreRegistration.findAll, щоб викликати помилку
			PreRegistration.findAll.mockRejectedValueOnce(
				new Error("Database error")
			);

			await PreRegistrationControler.getAll({}, res, next);

			expect(next).toHaveBeenCalledWith(
				ApiError.internal("Ошибка при получении данных пользователей")
			);
			expect(res.json).not.toHaveBeenCalled();
		});

		// Інші тести для методу getAll
	});

	describe("deletePreRegistrationUser", () => {
		// Тесты для метода deletePreRegistrationUser
		it("should delete pre-registered users by email", async () => {
			// Змішане тіло запиту
			const req = { body: ["user1@example.com", "user2@example.com"] };
			// Висміяний об’єкт відповіді
			const res = { json: jest.fn() };
			const next = jest.fn();

			// Mock PreRegistration.destroy для повернення кількості видалених користувачів
			PreRegistration.destroy.mockResolvedValueOnce(2);

			await PreRegistrationControler.deletePreRegistrationUser(req, res, next);

			expect(res.json).toHaveBeenCalledWith({
				message: "Успешно удалено 2 пользователей.",
			});
			expect(next).not.toHaveBeenCalled();
		});


		it("should handle errors while deleting pre-registered users", async () => {
			// Змішане тіло запиту
			const req = { body: ["user1@example.com"] };
			// Висміяний об’єкт відповіді
			const res = { json: jest.fn() };
			const next = jest.fn();

			// Mock PreRegistration.destroy, щоб викликати помилку
			PreRegistration.destroy.mockRejectedValueOnce(
				new Error("Database error")
			);

			await PreRegistrationControler.deletePreRegistrationUser(req, res, next);

			expect(next).toHaveBeenCalledWith(
				ApiError.internal("Ошибка при удалении пользователей по email")
			);
			expect(res.json).not.toHaveBeenCalled();
		});

		// Інші тести для методу deletePreRegistrationUser
	});
});
