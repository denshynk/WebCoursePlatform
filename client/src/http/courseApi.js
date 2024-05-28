import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const createCourse = async (course) => {
	const { data } = await $authHost.post("api/cours/createCours", 
		course
	);

	return data;
};

export const fetchCourse = async () => {
	const { data } = await $host.get("api/cours/allCourses");
	return data;
};

export const fetchOneCourse = async (id) => {
	const { data } = await $host.get("api/cours/" + id);
	return data;
};

