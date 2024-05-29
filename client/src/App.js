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

	useEffect(() => {
		setTimeout(() => {
			check()
				.then((data) => {
					user.setUser(true);
					user.setIsAuth(true);
				})
				.finally(() => setLoading(false));
		}, 1000);
	}, []);

	if (loading) {
		return (
			<Spinner
				className="d-flex justify-contenc-center align-items-center "
				animation="border"
				role="status"
				
			/>
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
