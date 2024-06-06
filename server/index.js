require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const models = require("./models/models");
const cors = require("cors");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 6000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
app.use("/api", router);

//Обработка ошибок
app.use(errorHandler);

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
	} catch (error) {
		console.log(error);
	}
};

start();
