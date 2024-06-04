import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const registration = async (email, password, group, name, surname) => {
	const { data } = await $host.post("api/preregistration", {
		email,
		password,
		group,
		name,
		surname,
	});
};

export const AgreeRegistration = async (users) => {
	const { data } = await $authHost.post("api/user/registration", users);
	return data;
};

export const deletePreRegistrationUser = async (users) => {
	const emails = users.map((user) => user.email);
	console.log(emails);
	const { data } = await $authHost.post("api/preregistration/delete", emails);
	return data;
};

export const fetchAllPreRegistratio = async () => {
	const { data } = await $authHost.get("api/preregistration");
	return data;
};

export const fetchAllUsers = async () => {
	const { data } = await $authHost.get("api/user/getAllUsers");
	return data;
};
export const addUserToCours = async (courseUsers) => {
	const { data } = await $authHost.post(
		"api/userCourse/addtocourse",
		courseUsers
	);
	return data;
};

export const login = async (email, password) => {
	const { data } = await $host.post("api/user/login", {
		email,
		password
	});
	localStorage.setItem("token", data.token);
	return {
		token: data.token,
		userData: data.dataUser,
		courses: data.courses,
	};
};



export const check = async () => {
	const { data } = await $authHost.get('api/user/auth')
	localStorage.setItem('token', data.token)
	const dataToken = jwtDecode(data.token);
	const userData = data.dataUser;
	return { dataToken, userData };
};
