const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("user", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	email: { type: DataTypes.STRING, unique: true },
	name: { type: DataTypes.STRING },
	surname: { type: DataTypes.STRING },
	password: { type: DataTypes.STRING },
	group: { type: DataTypes.STRING, allowNull: true },
	role: { type: DataTypes.ENUM("User", "Admin"), defaultValue: "User" },
	// User role can be either 'User' or 'Admin'
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
	paragraphId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key referencing Paragraph
	img: { type: DataTypes.STRING },
});

const Test = sequelize.define("test", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING },
	choseAnswer: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
	themeId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key referencing Theme
});

const TestCategory = sequelize.define("test_category", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	CategoryName: { type: DataTypes.STRING },
});

const Answer = sequelize.define("answer", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	text: { type: DataTypes.STRING },
	isCorrect: { type: DataTypes.BOOLEAN, defaultValue: true },
	testId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key referencing Test
});

const FinalResult = sequelize.define("finalResult", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	userId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key referencing User
	courseId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key referencing Course
	result: { type: DataTypes.STRING }, // Example: "3/5" for 3 out of 5 correct answers
});

const UserCourse = sequelize.define("user_course", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketUserCourse = sequelize.define("basket_user_course", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const UserAnswer = sequelize.define("user_answer", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	correctAnswers: { type: DataTypes.STRING, allowNull: false },
});

const PreRegistration = sequelize.define("pre_registration", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	email: { type: DataTypes.STRING, unique: true },
	password: { type: DataTypes.STRING },
	name: { type: DataTypes.STRING },
	surname: { type: DataTypes.STRING },
	group: { type: DataTypes.STRING, allowNull: true },
});

// Каждый курс имеет параграфы

User.hasOne(UserCourse);
UserCourse.belongsTo(User);

UserCourse.hasMany(BasketUserCourse);
BasketUserCourse.belongsTo(UserCourse);

Course.hasMany(BasketUserCourse);
BasketUserCourse.belongsTo(Course);

Course.hasMany(Paragraph);
Paragraph.belongsTo(Course);

Paragraph.hasMany(Theme);
Theme.belongsTo(Paragraph);

Theme.hasMany(Test);
Test.belongsTo(Theme);

TestCategory.hasMany(Test);
Test.belongsTo(TestCategory);

Test.hasMany(UserAnswer);
UserAnswer.belongsTo(Test);

Test.hasMany(Answer);
Answer.belongsTo(Test);

Course.hasMany(FinalResult);
FinalResult.belongsTo(Course);

User.hasMany(FinalResult);
FinalResult.belongsTo(User);

User.hasMany(UserAnswer);
UserAnswer.belongsTo(User);

module.exports = {
	User,
	Course,
	Paragraph,
	Theme,
	Test,
	Answer,
	FinalResult,
	PreRegistration,
	UserAnswer,
};
