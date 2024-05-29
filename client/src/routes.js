// routes.js
import Admin from "./pages/Admin";
import {
	ACOUNT_ROUTE,
	ADMIN_ROUTE,
	ALL_COURSES_ROUTE,
	BASKET_COURSE_ROUTE,
	COURSE_ROUTE,
	LOGIN_ROUTE,
	REGISTRATION_ROUTE,
} from "./utils/consts";
import Course from "./pages/Course";
import AllCourse from "./pages/AllCourse";
import MyCourses from "./pages/MyCourses";
import Auth from "./pages/Auth.js";
import Account from "./pages/Acount.js";

export const authRoutes = [
	{
		path: ADMIN_ROUTE,
		element: <Admin />,
	},

	{
		path: ACOUNT_ROUTE,
		element: <Account />,
	},
	{
		path: COURSE_ROUTE + "/:id",
		element: <Course />,
	},
	{
		path: ALL_COURSES_ROUTE,
		element: <AllCourse />,
	},
	{
		path: BASKET_COURSE_ROUTE,
		element: <MyCourses />,
	},
];

export const publicRoutes = [
	{
		path: LOGIN_ROUTE,
		element: <Auth />,
	},
	{
		path: REGISTRATION_ROUTE,
		element: <Auth />,
	},
];
