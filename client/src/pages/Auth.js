import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
	ALL_COURSES_ROUTE,
	LOGIN_ROUTE,
	REGISTRATION_ROUTE,
} from "../utils/consts";
import { login, registration } from "../http/userApi";
import { observer } from "mobx-react-lite";
import { Context } from "..";

const Auth = observer(() => {
	const { user } = useContext(Context);
	const location = useLocation();
	const navigate = useNavigate();
	const isLogin = location.pathname === LOGIN_ROUTE;
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [surname, setSurName] = useState("");
	const [groupPrefix, setGroupPrefix] = useState("ІС");
	const [groupNumber, setGroupNumber] = useState("");
	const [isRegistrationRequested, setIsRegistrationRequested] = useState(
		localStorage.getItem("isRegistrationRequested") === "true"
	);

	useEffect(() => {
		localStorage.setItem("isRegistrationRequested", isRegistrationRequested);
	}, [isRegistrationRequested]);

	const click = async () => {
		try {
			let data;
			if (isLogin) {
				data = await login(email, password);
				user.setUser(user);
				user.setIsAuth(true);
				navigate(ALL_COURSES_ROUTE);
			} else {
				data = await registration(
					email,
					password,
					`${groupPrefix}-${groupNumber}`,
					firstName,
					surname
				);
				setIsRegistrationRequested(true);
			}
		} catch (e) {
			alert(e.response.data.message);
		}
	};

	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ height: window.innerHeight - 54 }}
		>
			<Card style={{ width: 600 }} className="p-5">
				{isRegistrationRequested && !isLogin ? (
					<>
						<h2 className="m-auto text-center">
							Запит на реєстрацію відправлено
						</h2>
						<p className="mt-4 text-center">
							Дуже скоро його одобрять і Ви матимете змогу користуватися
							особистим кабінетом.
						</p>
						<div className="text-center mt-4">
							<NavLink to={LOGIN_ROUTE}>Увійти</NavLink>
						</div>
					</>
				) : (
					<>
						<h2 className="m-auto">{isLogin ? "Увійти" : "Реєстрація"}</h2>
						<Form className="d-flex flex-column">
							<Form.Control
								className="mt-4"
								placeholder="Введіть email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Form.Control
								className="mt-4"
								placeholder="Введіть пароль"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								type="password"
							/>
							{!isLogin && (
								<>
									<Form.Control
										className="mt-4"
										placeholder="Введіть ім'я"
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
									/>
									<Form.Control
										className="mt-4"
										placeholder="Введіть прізвище"
										value={surname}
										onChange={(e) => setSurName(e.target.value)}
									/>
									<Row className="mt-4">
										<Col md={4}>
											<Form.Select
												value={groupPrefix}
												onChange={(e) => setGroupPrefix(e.target.value)}
											>
												<option value="ІС">ІС</option>
												<option value="КН">КН</option>
												<option value="ПМ">ПМ</option>
												{/* Добавьте другие префиксы групп по мере необходимости */}
											</Form.Select>
										</Col>
										<Col md={8}>
											<Form.Control
												placeholder="Номер групи"
												value={groupNumber}
												onChange={(e) => setGroupNumber(e.target.value)}
											/>
										</Col>
									</Row>
								</>
							)}
							<div className="d-flex justify-content-between mt-3 pl-3 pr-3">
								{isLogin ? (
									<div>
										Нема аккаунту?{" "}
										<NavLink to={REGISTRATION_ROUTE}>Зареєструватись</NavLink>
									</div>
								) : (
									<div>
										Є акаунт? <NavLink to={LOGIN_ROUTE}>Увійти</NavLink>
									</div>
								)}
								<Button variant={"outline-success"} onClick={click}>
									{isLogin ? "Увійти" : "Реєстрація"}
								</Button>
							</div>
						</Form>
					</>
				)}
			</Card>
		</Container>
	);
});

export default Auth;
