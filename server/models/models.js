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
	// Роль користувача може бути "Користувач" або "Адміністратор"
});

const Course = sequelize.define("course", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Paragraph = sequelize.define("paragraph", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, unique: false },
	text: { type: DataTypes.TEXT, unique: false },
	courseId: { type: DataTypes.INTEGER, allowNull: false }, // Курс посилання на зовнішній ключ
});

const Theme = sequelize.define("theme", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING },
	description: { type: DataTypes.TEXT },
	paragraphId: { type: DataTypes.INTEGER, allowNull: false }, // Параграф із посиланням на зовнішній ключ
	img: { type: DataTypes.STRING },
});

const ThemText = sequelize.define("them_text", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	number: { type: DataTypes.INTEGER, allowNull: false },
	title: { type: DataTypes.STRING, allowNull: true },
	text: { type: DataTypes.TEXT, allowNull: false },
});

const Test = sequelize.define("test", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, allowNull: false },
	time: { type: DataTypes.INTEGER, allowNull: false },
	atemps: { type: DataTypes.INTEGER, allowNull: false },
	themeId: { type: DataTypes.INTEGER, allowNull: false }, // Тема посилання на зовнішній ключ
});

const Question = sequelize.define("questions", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING },
	choseAnswer: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
});

const TestCategory = sequelize.define("test_category", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	CategoryName: { type: DataTypes.STRING },
	coefficient:{type:DataTypes.FLOAT}
});

const Answer = sequelize.define("answer", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	text: { type: DataTypes.STRING },
});

const FinalResult = sequelize.define("finalResult", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	userId: { type: DataTypes.INTEGER, allowNull: false }, // Зовнішній ключ, що посилається на користувача
	courseId: { type: DataTypes.INTEGER, allowNull: false }, // Курс посилання на зовнішній ключ
	result: { type: DataTypes.STRING }, // Приклад: «3/5» за 3 з 5 правильних відповідей
});

const UserCourse = sequelize.define("user_course", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketUserCourse = sequelize.define("basket_user_course", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const UserAnswer = sequelize.define("user_answer", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	userAnswers: { type: DataTypes.STRING, allowNull: false },
	questionTitle: { type: DataTypes.STRING, allowNull: false },
	IsCorect: { type: DataTypes.BOOLEAN, allowNull: false },
	atemp: { type: DataTypes.INTEGER, allowNull: false },
});

const PreRegistration = sequelize.define("pre_registration", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	email: { type: DataTypes.STRING, unique: true },
	password: { type: DataTypes.STRING },
	name: { type: DataTypes.STRING },
	surname: { type: DataTypes.STRING },
	group: { type: DataTypes.STRING, allowNull: true },
});

// Кожен курс має параграфи

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

TestCategory.hasMany(Question);
Question.belongsTo(TestCategory);

Test.hasMany(UserAnswer);
UserAnswer.belongsTo(Test);

Question.hasOne(Answer);
Answer.belongsTo(Question);

Course.hasMany(FinalResult);
FinalResult.belongsTo(Course)

Course.hasMany(UserAnswer);
UserAnswer.belongsTo(Course);

User.hasMany(FinalResult);
FinalResult.belongsTo(User);

User.hasMany(UserAnswer);
UserAnswer.belongsTo(User);

Course.hasMany(Test);
Test.belongsTo(Course);

Test.hasMany(UserAnswer);
UserAnswer.belongsTo(Test);

Question.hasMany(UserAnswer);
UserAnswer.belongsTo(Question);

Test.hasMany(Question);
Question.belongsTo(Test);

Theme.hasMany(ThemText);
ThemText.belongsTo(Theme);

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
	UserCourse,
	ThemText,
	TestCategory,
	Question,
	BasketUserCourse,
};
