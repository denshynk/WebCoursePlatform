import React, { useContext } from "react";
import { Context } from "../index.js";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import {
	ACOUNT_ROUTE,
	ADMIN_ROUTE,
	BASKET_COURSE_ROUTE,
	LOGIN_ROUTE,
} from "../utils/consts.js";
import { Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const NavBar = observer(() => {
	const navigate = useNavigate();
	const { user } = useContext(Context);
	const logOut = () => {
		user.setUser({});
		user.setIsAuth(false);
		localStorage.removeItem("token");
	};

	return (
		<Navbar bg="dark" data-bs-theme="dark">
			<Container>
				<NavLink
					style={{ color: "white", textDecoration: "none" }}
					to={ACOUNT_ROUTE}
				>
					KPI Web-Course
				</NavLink>
				{user.isAuth ? (
					<Nav className="ml-auto" style={{ color: "white" }}>
						<Button
							variant={"outline-light"}
							onClick={() => navigate(ADMIN_ROUTE)}
						>
							Адміністратор
						</Button>
						<Button
							variant={"outline-light"}
							onClick={() => {
								logOut();
								navigate(LOGIN_ROUTE);
							}}
							style={{ marginLeft: "4px" }}
						>
							Вийти
						</Button>
					</Nav>
				) : (
					<Nav className="ml-auto" style={{ color: "white" }}>
						<Button
							variant={"outline-light"}
							onClick={() => navigate(LOGIN_ROUTE)}
						>
							Авторизація
						</Button>
					</Nav>
				)}
			</Container>
		</Navbar>
	);
});

export default NavBar;
