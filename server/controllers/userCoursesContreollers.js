const ApiError = require("../error/ApiError");
const {
	User,
	UserCourse,
	BasketUserCourse,
} = require("../models/models");

class UserCoursesController {
	async addToCourse(req, res, next) {
		const { courseId, usersId } = req.body;
try {
    const users = await Promise.all(
        usersId.map(async (oneUserId) => {
            const userCourse = await UserCourse.findOne({
                where: { userId: oneUserId },
                include: [
                    {
                        model: BasketUserCourse,
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                    },
                ],
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });

             // Перевірка, якщо userCourse або basket_user_courses відсутня
			 if (!userCourse || !userCourse.basket_user_courses) {
                throw new Error(
									`UserCourse або BasketUserCourse не знайдено для користувача з ID ${oneUserId}`
								);
            }

            // Проверка на наличие курса у студента
            const courses = userCourse.basket_user_courses.map(course => course.dataValues);
            const courseExists = courses.some((course) => course.courseId === parseInt(courseId));
			if (courseExists) {
                // Якщо курс є, повернути повідомлення
                const user = await User.findOne({ where: { id: usersId } }); // Припускаємо, що є модель User для отримання імені та прізвища студента
                const errorMessage = `Студента ${user.name} ${user.surname} вже додано до курсу.`;
                throw new Error(errorMessage);
            }

            // Якщо курсу немає, додаємо новий
            await BasketUserCourse.create({
                userCourseId: userCourse.id,
                courseId: courseId
            });

            return userCourse;
        })
    );
    res.status(200).json({ message: "Курси успішно додані", users });
} catch (error) {
    // Обробка помилки та виведення повідомлення
    res.status(400).json({ error: error.message });
}
	}
}

module.exports = new UserCoursesController();
