const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const CoursController = require("../controllers/coursСontrollers"); // Імпортуємо контролер
const {
	Course,
	UserCourse,
	FinalResult,
} = require("../models/models");

// Створюємо експрес додаток для тестування
const app = express();
app.use(bodyParser.json());

// Маршрути для контролера курсів
app.post("/courses", CoursController.create);
app.get("/courses", CoursController.getAll);
app.get(
	"/my-courses",
	(req, res, next) => {
		req.user = { id: 1 }; // Мокаємо користувача
		next();
	},
	CoursController.getAllMyCourses
);
app.get("/courses/:id", CoursController.getOne);

// Мокаємо моделі
jest.mock("../models/models");

describe("CoursController", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("create", () => {
		it("should create a course", async () => {
			const newCourse = { id: 1, title: "Test Course" };
			Course.create.mockResolvedValueOnce(newCourse);

			const response = await request(app)
				.post("/courses")
				.send({ title: "Test Course" });

			expect(response.status).toBe(200);
			expect(response.body).toEqual(newCourse);
		});
	});

	describe("getAll", () => {
		it("should return all courses", async () => {
			const courses = [{ id: 1, title: "Test Course" }];
			Course.findAll.mockResolvedValueOnce(courses);

			const response = await request(app).get("/courses");

			expect(response.status).toBe(200);
			expect(response.body).toEqual(courses);
		});
	});

	describe("getAllMyCourses", () => {
		it("should return all user courses with final results", async () => {
			const userCourses = [
				{
					userId: 1,
					basket_user_courses: [{ course: { id: 1, title: "Course 1" } }],
				},
			];
			const finalResults = [{ courseId: 1, result: 85 }];

			UserCourse.findAll.mockResolvedValueOnce(userCourses);
			FinalResult.findAll.mockResolvedValueOnce(finalResults);

			const response = await request(app).get("/my-courses");

			expect(response.status).toBe(200);
			expect(response.body).toEqual([{ id: 1, title: "Course 1", result: 85 }]);
		});

		it("should handle errors and return 500 status with error message", async () => {
			UserCourse.findAll.mockRejectedValueOnce(
				new Error("Internal Server Error")
			);

			const response = await request(app).get("/my-courses");

			expect(response.status).toBe(500);
			expect(response.body).toEqual({ error: "Internal Server Error" });
		});
	});

	describe("getOne", () => {
		it("should return a single course with paragraphs, themes, tests, and texts", async () => {
			const course = {
				id: 1,
				title: "Course 1",
				paragraphs: [
					{
						id: 1,
						title: "Paragraph 1",
						themes: [
							{
								id: 1,
								title: "Theme 1",
								tests: [{ id: 1, title: "Test 1" }],
								them_texts: [{ id: 1, content: "Text 1" }],
							},
						],
					},
				],
			};

			Course.findOne.mockResolvedValueOnce(course);

			const response = await request(app).get("/courses/1");

			expect(response.status).toBe(200);
			expect(response.body).toEqual(course);
		});

		it("should return 404 if course is not found", async () => {
			Course.findOne.mockResolvedValueOnce(null);

			const response = await request(app).get("/courses/1");

			expect(response.status).toBe(404);
			expect(response.body).toEqual({ message: "Course not found" });
		});
	});
});
