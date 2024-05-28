import { makeAutoObservable } from "mobx";

export default class CoursesStore {
	constructor() {
		this._paragraph = [
		];
		this._them = [
		
		];

		this._tests = [
		

		];

		this._courses = [];
		makeAutoObservable(this);
	}

	setParagraph(paragraph) {
		this._paragraph = paragraph;
	}
	setTest(test) {
		this._test = test;
	}
	setThem(them) {
		this._them = them;
	}
	setCourses(courses) {
		this._courses = courses;
	}

	get Paragraph() {
		return this._paragraph;
	}

	get Them() {
		return this._them;
	}
	get Test() {
		return this._tests; // Исправлено: должно быть this._tests
	}
	get Courses() {
		return this._courses;
	}
}
