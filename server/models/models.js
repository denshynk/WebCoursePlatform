const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("user", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	email: { type: DataTypes.STRING, unique: true },
	password: { type: DataTypes.STRING },
	role: { type: DataTypes.ENUM("User", "Admin"), defaultValue: "User" }, // User role can be either 'User' or 'Admin'
	courses: { type: DataTypes.ARRAY(DataTypes.INTEGER) }, // Array of course IDs
});

const Course = sequelize.define("course", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, unique: true },
});

const Paragraph = sequelize.define("paragraph", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, unique: true },
	courseId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key referencing Course
});

const Theme = sequelize.define("theme", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING },
	description: { type: DataTypes.STRING },
	img: { type: DataTypes.STRING },
});

const Test = sequelize.define("test", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, unique: true },
	themeId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key referencing Theme
});

const Question = sequelize.define("question", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	text: { type: DataTypes.STRING },
});

const Answer = sequelize.define("answer", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	text: { type: DataTypes.STRING },
	isCorrect: { type: DataTypes.BOOLEAN, defaultValue: false },
	testId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key referencing Test
});

const Rating = sequelize.define("rating", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	userId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key referencing User
	testId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key referencing Test
	score: { type: DataTypes.INTEGER },
});

const FinalResult = sequelize.define("finalResult", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	userId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key referencing User
	courseId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key referencing Course
	result: { type: DataTypes.STRING }, // Example: "3/5" for 3 out of 5 correct answers
});

// Define associations
Course.hasMany(Paragraph);
Paragraph.belongsTo(Course);

Theme.hasMany(Test);
Test.belongsTo(Theme);

Test.hasMany(Answer);
Answer.belongsTo(Test);

User.hasMany(Rating);
Rating.belongsTo(User);

Course.hasMany(FinalResult);
FinalResult.belongsTo(Course);
User.hasMany(FinalResult);
FinalResult.belongsTo(User);

module.exports = {
	User,
	Course,
	Paragraph,
	Theme,
	Test,
	Question,
	Answer,
	Rating,
	FinalResult,
};
