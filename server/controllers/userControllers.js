const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, PreRegistration } = require("../models/models");

const generateJWT = (id, email, role) => {
	return jwt.sign({ id, email, role }, process.env.SECRET_KEY_JWT, {
		expiresIn: "24h",
	});
};

class UserController {
	async registration(req, res, next) {
		let users = req.body;
		console.log(users);
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

			// Здесь можете добавить проверки на name, surname и group, как вы сделали в вашем коде.

			// Создаем всех пользователей
			const createdUsers = await Promise.all(
				userData.map(async (userData) => {
					const { email, password, name, surname, group, role } = userData;
					const candidate = await User.findOne({ where: { email } });
					if (candidate) {
						return next(
							ApiError.badRequest("Пользователь с таким email уже существует")
						);
					}

					return User.create({
						email,
						role, // Установите роль пользователя по умолчанию или сделайте это динамически
						password,
						name,
						surname,
						group,
					});
				})
			);

			// Удаляем всех пользователей из таблицы PreRegistration
			await PreRegistration.destroy({
				where: { email: users.map((user) => user.email) },
			});
		} catch (error) {
			console.error("Error during registration:", error);
			next(error);
		}
	}

	async login(req, res, next) {
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return next(ApiError.internal("Пользователь не найден"));
		}
		let comparePassword = bcrypt.compareSync(password, user.password);
		if (!comparePassword) {
			return next(ApiError.internal("Указан неверный пароль"));
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
		const token = generateJWT(req.user.id, req.user.email, req.user.role);
		const email = req.user.email 
		const user = await User.findOne({ where: { email } });
		const dataUser = {
			email: user.email,
			name: user.name,
			surname: user.surname,
			group: user.group,
			role: user.role,
		};
		return res.json({ token, dataUser });
	}
}

module.exports = new UserController();
