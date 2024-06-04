const ApiError = require("../error/ApiError");
const {
	User,
	PreRegistration,
	UserCourse,
	BasketUserCourse,
} = require("../models/models");


class UserCoursesController {
	async addToCourse(req, res, next) {
		try {
			const { courseId, usersId } = req.body;
			console.log();

		} catch (error) {
			next(error);
		}
	}
}

module.exports = new UserCoursesController();
