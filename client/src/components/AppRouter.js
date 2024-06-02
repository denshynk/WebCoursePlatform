import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { authRoutes, publicRoutes } from "../routes";
import { ACOUNT_ROUTE, LOGIN_ROUTE } from "../utils/consts";
import { Context } from "../index";

const AppRouter = () => {
	const { user } = useContext(Context);
	const navigate = useNavigate();
	const [isFirstVisit, setIsFirstVisit] = useState(
		!localStorage.getItem("hasVisited")
	);

	useEffect(() => {
		if (isFirstVisit) {
			localStorage.setItem("hasVisited", "true");
			if (user.isAuth) {
				navigate(ACOUNT_ROUTE);
			} else {
				navigate(LOGIN_ROUTE);
			}
			setIsFirstVisit(false);
		}
	}, [isFirstVisit, navigate, user.isAuth]);

	return (
		<Routes>
			{user.isAuth &&
				authRoutes.map(({ path, element }) => (
					<Route key={path} path={path} element={element} exact />
				))}
			{publicRoutes.map(({ path, element }) => (
				<Route key={path} path={path} element={element} exact />
			))}
			<Route
				path="*"
				element={<Navigate to={user.isAuth ? ACOUNT_ROUTE : LOGIN_ROUTE} />}
			/>
		</Routes>
	);
};

export default AppRouter;
