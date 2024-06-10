const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
	if (req.method === "OPTIONS") {
		return next();
	}

	try {
		const authHeader = req.headers.authorization;
		const token = authHeader.split(" ")[1]; // Bearer
		// Перевірка на наявність токена після розбиття рядка
		if (token === "null") {
			return res.status(401).json({ message: "Не авторизован" });
		}
		const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
		req.user = decoded;
		next();
	} catch (e) {
		console.error("Помилка під час перевірки токена:", e); // Логування помилки для налагодження
		return res.status(401).json({ message: "Помилка під час перевірки токена" });
	}
};
