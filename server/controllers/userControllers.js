const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
	User,
	PreRegistration,
	UserCourse,
	BasketUserCourse,
} = require("../models/models");

const generateJWT = (id, email, role) => {
	return jwt.sign({ id, email, role }, process.env.SECRET_KEY_JWT, {
		expiresIn: "24h",
	});
};

class UserController {
	async registration(req, res, next) {
		let users = req.body;
		try {
			const userData = await Promise.all(
				users.map(async (user) => {
					const preUser = await PreRegistration.findOne({
						where: { email: user.email },
					});
					return {
						email: user.email,
						password: preUser.password,
						name: user.name,
						surname: user.surname,
						group: user.group,
						role: user.role,
					};
				})
			);

			const createdUsers = await Promise.all(
				userData.map(async (userData) => {
					const { email, password, name, surname, group, role } = userData;
					const candidate = await User.findOne({ where: { email } });
					if (candidate) {
						return next(
							ApiError.badRequest(
						`Користувач з таким ${email} вже існує`
							)
						);
					}

					const newUser = await User.create({
						email,
						role,
						password,
						name,
						surname,
						group,
					});

					// Створення запису в UserCourse для нового користувача
					await UserCourse.create({
						userId: newUser.id,
					});
				})
			);

			// Видаляємо всіх користувачів із таблиці PreRegistration
			await PreRegistration.destroy({
				where: { email: users.map((user) => user.email) },
			});

			return res.status(200).json({ message: "Success" });
		} catch (error) {
			
			next(error);
		}
	}

	async login(req, res, next) {
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return next(ApiError.internal("Користувач не знайдений"));
		}
		let comparePassword = bcrypt.compareSync(password, user.password);
		if (!comparePassword) {
			return next(ApiError.internal("Вказано неправильний пароль"));
		}
		const token = generateJWT(user.id, user.email, user.role);
		const dataUser = {
			email: user.email,
			name: user.name,
			surname: user.surname,
			group: user.group,
			role: user.role,
		};
		return res.json({ token, dataUser });
	}

	async check(req, res, next) {
		try {
	
				const token = generateJWT(req.user.id, req.user.email, req.user.role);
				const email = req.user.email;
				const user = await User.findOne({ where: { email } });
				const dataUser = {
					email: user.email,
					name: user.name,
					surname: user.surname,
					group: user.group,
					role: user.role,
					id: user.id,
				};
				return res.json({ token, dataUser });
			
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async getAllUsers(req, res, next) {
		try {
			const users = await User.findAll({
				attributes: { exclude: ["password", "createdAt", "updatedAt", "role"] },
				where: { role: "User" },
				include: [
					{
						model: UserCourse,
						attributes: { exclude: ["createdAt", "updatedAt"] },
						include: [
							{
								model: BasketUserCourse,
								attributes: {
									exclude: ["createdAt", "updatedAt", "userCourseId"],
								},
							},
						], 
					},
				],
			});

			if (!users || users.length === 0) {
				return res.status(404).json({ message: "Користувачів не знайдено" });
			}

			res.status(200).json(users);
		} catch (error) {
			next(error); // передача помилки в обробник помилок Express
		}
	}
}

module.exports = new UserController();
