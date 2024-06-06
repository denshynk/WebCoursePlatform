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
        usersId.map(async (basketuserId) => {
            const userCourse = await UserCourse.findOne({
                where: { userId: basketuserId },
                include: [
                    {
                        model: BasketUserCourse,
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                    },
                ],
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });

             // Проверка, если userCourse или basket_user_courses отсутствует
			 if (!userCourse || !userCourse.basket_user_courses) {
                throw new Error(`UserCourse или BasketUserCourse не найдены для пользователя с ID ${basketuserId}`);
            }

            // Проверка на наличие курса у студента
            const courses = userCourse.basket_user_courses.map(course => course.dataValues);
            const courseExists = courses.some((course) => course.courseId === parseInt(courseId));
			if (courseExists) {
                // Если курс уже есть, вернуть сообщение
                const user = await User.findOne({ where: { id: usersId } }); // Предполагаем, что есть модель User для получения имени и фамилии студента
                const errorMessage = `Студент ${user.name} ${user.surname} уже добавлен к курсу.`;
                throw new Error(errorMessage);
            }

            // Если курса нет, добавляем новый
            await BasketUserCourse.create({
                userCourseId: userCourse.id,
                courseId: courseId
            });

            return userCourse;
        })
    );
    res.status(200).json({ message: "Курсы успешно добавлены", users });
} catch (error) {
    // Обработка ошибки и вывод сообщения
    res.status(400).json({ error: error.message });
}
	}
}

module.exports = new UserCoursesController();
