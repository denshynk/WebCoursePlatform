import { $authHost, $host } from "./index";

export const createCourse = async (course) => {
	const { data } = await $authHost.post("api/cours/createCours", course);
	return data;
};

export const fetchCourse = async () => {
	const { data } = await $host.get("api/cours/allCourses");
	return data;
};

export const createParagraph = async (paragraph) => {
	const { data } = await $authHost.post("api/paragraph/create", paragraph);

	return data;
};

export const fetchParagraph = async (courseId) => {
	const { data } = await $authHost.get(
		`api/paragraph/coursParagraph/${courseId}`
	);
	return data;
};

export const updateParagraph = async (updatedParagraph) => {
	const { data } = await $authHost.post("api/paragraph/updateParagraph", updatedParagraph);
	return data;
};

export const deleteParagraph = async (id) => {
	const { data } = await $authHost.delete(
		"api/paragraph/deleteParagraph/" + id
	);
	return data;
};

export const createTheme = async (theme) => {
	const { data } = await $authHost.post("api/theme/create", theme);

	return data;
};

export const updateText = async (updatedText) => {
	const { data } = await $authHost.post(
		"api/theme/theme_text",
		updatedText
	);
	return data;
};
export const deleteText = async (id) => {
	const { data } = await $authHost.delete("api/theme/theme_text/delete" + id);
	return data;
};


export const createTest = async (test) => {
	const { data } = await $authHost.post("api/test/create", test);

	return data;
};

export const fetchTheme = async (paragraphId) => {
	const { data } = await $authHost.get(
		`api/theme/paragraphTheme/${paragraphId}`
	);
	return data;
};

export const updateTheme = async (updatedParagraph) => {
	const { data } = await $authHost.post(
		"api/paragraph/updateParagraph22",
		updatedParagraph
	);
	return data;
};

export const deleteTheme = async (id) => {
	const { data } = await $authHost.delete(
		"api/paragraph/deleteParagraphыв/" + id
	);
	return data;
};

export const fetchTestCategory = async () => {
	const { data } = await $authHost.get(`api/testcategory`);
	return data;
};

export const fetchOneCourse = async (id) => {
	const { data } = await $host.get("api/cours/" + id);
	return data;
};
