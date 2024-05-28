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
	const { data } = await $host.get("api/preregistration");
	return data;
};

export const login = async (email, password) => {
	const { data } = await $host.post("api/user/login", {
		email,
		password,
	});
	localStorage.setItem("token", data.token);
	return jwtDecode(data.token);
};

export const check = async (email, password) => {
	const { data } = await $authHost.get("api/user/auth");
	localStorage.setItem("token", data.token);
	return jwtDecode(data.token);
};
