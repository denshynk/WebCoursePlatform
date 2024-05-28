import React, { useContext } from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import { authRoutes, publicRoutes,  } from "../routes.js"; // Путь изменен на "./routes.js"
import { LOGIN_ROUTE } from "../utils/consts";
import { Context } from "../index.js";

const AppRouter = () => {
    const { user } = useContext(Context)
   

	return (
		<Routes>
			{user.isAuth &&
				authRoutes.map(({ path, element }) => (
					<Route key={path} path={path} element={element} exact />
				))}
			{publicRoutes.map(({ path, element }) => (
				<Route key={path} path={path} element={element} exact />
			))}
			<Route path="*" element={<Navigate to={LOGIN_ROUTE} />} />
		</Routes>
	);
};

export default AppRouter;
