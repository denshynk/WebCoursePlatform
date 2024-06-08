import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userApi";
import { Spinner } from "react-bootstrap";

const App = observer(() => {
	const { user } = useContext(Context);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null); // добавляем состояние для ошибок

	useEffect(() => {
		setTimeout(() => {
			check()
				.then((data) => {
					user.setUser(data.userData);
					user.setIsAuth(true);
				})
				.catch((err) => {
					setError(err.message); // сохраняем сообщение об ошибке
				})

				.finally(() => setLoading(false));
		}, 1000);
	}, []);

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center " style={{height:'100vh'}}>
				
				<Spinner  animation="border" role="status" />
			</div>
		);
	}

	return (
		<BrowserRouter>
			<NavBar />
			<AppRouter />
		</BrowserRouter>
	);
});

export default App;
