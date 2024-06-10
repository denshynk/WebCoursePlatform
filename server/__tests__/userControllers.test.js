const request = require("supertest");
const express = require("express");
const app = express();

const userController = require("../controllers/userControllers");
const jwt = require("jsonwebtoken");
const { User, PreRegistration, UserCourse } = require("../models/models");

jest.mock("jsonwebtoken");
jest.mock("../models/models");

describe("User Controller", () => {
	describe("Registration", () => {
		it("should register a new user", async () => {
			const req = {
				body: [
					{
						email: "test@example.com",
						name: "Test",
						surname: "User",
						group: "TestGroup",
						role: "User",
					},
				],
			};
			const res = {
				json: jest.fn(), // Шпигун за методом json
			};
			const next = jest.fn();

			PreRegistration.findOne.mockResolvedValueOnce({
				id: 99999,
				email: "test@example.com",
				name: "Test",
				surname: "User",
				password: "2b$10$NObu7O.zJqF7dV69pvz5w.yAcIBGn63ERoMoXhplwKOP1Vw9yhzDW",
				group: "1234",
			});

			User.create({
				email: "test@example.com",
				name: "Test",
				surname: "User",
				password: "2b$10$NObu7O.zJqF7dV69pvz5w.yAcIBGn63ERoMoXhplwKOP1Vw9yhzDW",
				group: "1234",
				role: "User",
			});

			UserCourse.create.mockResolvedValueOnce();

			await userController.registration(req, res, next);

			expect(next).toHaveBeenCalled();
			expect(res.json).not.toHaveBeenCalled();
		});

		it("should handle registration error", async () => {
			const req = {
				body: [
					{
						email: "test@example.com",
						password: "password",
						name: "Test",
						surname: "User",
						role: "User",
					},
				],
			};
			const res = {
				json: jest.fn(),
			};
			const next = jest.fn();

			PreRegistration.findOne.mockResolvedValueOnce({
				id: 99999,
				email: "test@example.com",
				name: "Test",
				surname: "User",
				password: "123456",
				group: "1234",
			});

			User.create.mockRejectedValueOnce(new Error("Database error"));

			await userController.registration(req, res, next);

			expect(res.json).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalledWith(new Error("Database error"));
		});
	});

	describe("Login", () => {
		it("should login a user with correct credentials", async () => {
			const req = {
				body: {
					email: "test2@gmail.com",
					password: "12345",
				},
			};
			const res = {
				json: jest.fn(),
			};
			const next = jest.fn();

			User.findOne.mockResolvedValueOnce({
				id: 2,
				email: "test2@gmail.com",
				role: "User",
				surname: "test2",
				group: "RF-2",
				name: "test2",
				password:
					"$2b$05$kxywer1uQkw7FRrudrf/1eW5Ch7Yc09g6bPdxCw8oSCx/K4o8VgWW",
			});

			await userController.login(req, res, next);

			expect(res.json).toHaveBeenCalled();
			expect(next).not.toHaveBeenCalled();
		});

		it("should handle login with incorrect credentials", async () => {
			const req = {
				body: {
					email: "test2@example.com",
					password: "wrongpassword",
				},
			};
			const res = {
				json: jest.fn(),
			};
			const next = jest.fn();

			User.findOne.mockResolvedValueOnce({
				id: 2,
				email: "test2@gmail.com",
				role: "User",
				surname: "test2",
				group: "RF-2",
				name: "test2",
				password:
					"$2b$05$kxywer1uQkw7FRrudrf/1eW5Ch7Yc09g6bPdxCw8oSCx/K4o8VgWW",
			});

			await userController.login(req, res, next);

			expect(res.json).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalledWith(new Error("Указан неверный пароль"));
		});

		it("should handle login error", async () => {
			const req = {
				body: {
					email: "test3@example.com",
					password: "12345",
				},
			};
			const res = {
				json: jest.fn(),
			};
			const next = jest.fn();

			await userController.login(req, res, next);

			expect(res.json).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalledWith(new Error("Пользователь не найден"));
		});
	});

	describe("Check Authentication", () => {
		it("should return user information if authenticated", async () => {
			const req = {
				user: {
					id: 1,
					email: "test2@example.com",
					role: "User",
				},
			};

			User.findOne.mockResolvedValueOnce({
				id: 2,
				email: "test2@gmail.com",
				role: "User",
				surname: "test2",
				group: "RF-2",
				name: "test2",
				password:
					"$2b$05$kxywer1uQkw7FRrudrf/1eW5Ch7Yc09g6bPdxCw8oSCx/K4o8VgWW",
			});

			const res = {
				json: jest.fn(),
			};
			const next = jest.fn();
			User.findOne.mockResolvedValueOnce(null);

			await userController.check(req, res, next);

			expect(res.json).toHaveBeenCalled();
			expect(next).not.toHaveBeenCalled();
		});

		it("should handle authentication error", async () => {
			const req = {
				user: null,
			};
			const res = {
				json: jest.fn(),
			};
			const next = jest.fn();

			await userController.check(req, res, next);

			expect(res.json).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});
	});

	describe("Get All Users", () => {
		it("should return all users for admin role", async () => {
			const req = {};
			const res = {
				json: jest.fn(),
				status: jest.fn(),
			};
			const next = jest.fn();

			const mockedUsers = [
				{
					id: 1,
					email: "test1@example.com",
					name: "Test1",
					surname: "User1",
				},
				{
					id: 2,
					email: "test2@example.com",
					name: "Test2",
					surname: "User2",
				},
			];

			User.findAll.mockResolvedValueOnce(mockedUsers);

			await userController.getAllUsers(req, res, next);

			expect(res.status).toHaveBeenCalledWith(200); // Перевірте, чи метод status викликається з 200

	
		});


		it("should handle error while getting all users", async () => {
			const req = {};
			const res = {
				json: jest.fn(),
			};
			const next = jest.fn();

			User.findAll.mockRejectedValueOnce(new Error("Database error"));

			await userController.getAllUsers(req, res, next);

			expect(res.json).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalledWith(new Error("Database error"));
		});
	});
});
