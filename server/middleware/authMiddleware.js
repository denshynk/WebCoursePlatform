const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
	if (req.method === "OPTIONS") {
		return next();
	}

	try {
		const authHeader = req.headers.authorization;
		const token = authHeader.split(" ")[1]; // Bearer
		// Проверка на наличие токена после разбиения строки
		if (token === "null") {
			// return res.status(401).json({ message: "Не авторизован" });
		}
		const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
		req.user = decoded;

		next();
	} catch (e) {
		console.error("Ошибка при проверке токена:", e); // Логирование ошибки для отладки
		return res.status(401).json({ message: "Ошибка при проверке токена" });
	}
};
