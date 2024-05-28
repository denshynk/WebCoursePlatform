const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PreRegistration } = require("../models/models");

const generateJWT = (id, email, role) => {
	return jwt.sign({ id, email, role }, process.env.SECRET_KEY_JWT, {
		expiresIn: "24h",
	});
};
class PreRegistrationControler {
	async preRegistration(req, res, next) {
		const { email, password, name, surname, group } = req.body;
		if (!email || !password) {
			return next(ApiError.badRequest("Некоректный email или password"));
		}
		if (!name) {
			return next(ApiError.badRequest("Некоректный Імя"));
		}
		if (!surname) {
			return next(ApiError.badRequest("Некоректный Прізвище"));
		}
		const candidate = await PreRegistration.findOne({ where: { email } });
		if (candidate) {
			return next(
				ApiError.badRequest("Пользоваетель с такми email уже существует")
			);
		}
		const hashPassword = await bcrypt.hash(password, 5);
		const user = await PreRegistration.create({
			email,
			password: hashPassword,
			group,
			name,
			surname,
		});
		const token = generateJWT(user.id, user.email, user.role);
		return res.json({ token });
	}
	async getAll(req, res, next) {
		try {
			const preUsers = await PreRegistration.findAll({
				attributes: { exclude: ["password"] },
			});
			return res.json(preUsers);
		} catch (error) {
			return next(
				ApiError.internal("Ошибка при получении данных пользователей")
			);
		}
	}

    async deletePreRegistrationUser(req, res, next) {
        
		let  email  = req.body;

		try {
			const deletedUsers = await Promise.all(
				email.map(async (email) => {
					const deletedUser = await PreRegistration.destroy({
						where: { email },
					});
					return deletedUser;
				})
			);

			const successfulDeletes = deletedUsers.filter(
				(deletedUser) => deletedUser !== 0
			);
			const failedDeletes = deletedUsers.filter(
				(deletedUser) => deletedUser === 0
			);

			if (successfulDeletes.length === 0) {
				return next(
					ApiError.notFound("Пользователи с указанными email не найдены")
				);
			}

			let message = `Успешно удалено ${successfulDeletes.length} пользователей.`;
			if (failedDeletes.length > 0) {
				message += ` Не удалось найти и удалить ${failedDeletes.length} пользователей.`;
			}

			return res.json({ message });
		} catch (error) {
			return next(
				ApiError.internal("Ошибка при удалении пользователей по email")
			);
		}
	}
}

module.exports = new PreRegistrationControler();
