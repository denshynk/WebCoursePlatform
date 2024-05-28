const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
	if (req.method === "OPTIONS") {
		return next();
	}

	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			// Пропускаем проверку, если заголовок авторизации отсутствует
			return next();
		}

		const token = authHeader.split(" ")[1];
		if (!token) {
			return res.status(401).json({ message: "Не авторизован" });
		}

		const decoder = jwt.verify(token, process.env.SECRET_KEY_JWT);
		req.user = decoder;
		next();
	} catch (e) {
		return res.status(401).json({ message: "Ошибка" });
	}
};
