const { TestCategory } = require("../models/models");

class TestController {
	async getAll(req, res) {
		const testcategory = await TestCategory.findAll();
		return res.json(testcategory);
	}
}

module.exports = new TestController();
