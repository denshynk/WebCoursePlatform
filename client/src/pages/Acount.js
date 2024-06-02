import React, { useContext } from "react";
import { Col, Container, Row, Table, Card } from "react-bootstrap";
import { Context } from "../index";

const Account = () => {
	const { user } = useContext(Context);
	console.log(user);
	// Пример данных пользователя, можно удалить, если данные берутся из контекста
	const userData = {
		name: user.user.name,
		email: user.user.email,
		group: user.user.group,
		surname: user.user.surname,

		courses: [
			{ id: 1, name: "Course 1", grade: "A" },
			{ id: 2, name: "Course 2", grade: "B" },
			{ id: 3, name: "Course 3", grade: "C" },
		],
		finalRating: "B+",
	};

	return (
		<Container className="mt-5">
			<Row>
				<Col md={4}>
					<Card>
						<Card.Body>
							<Card.Title>Профиль пользователя</Card.Title>
							<Card.Text>
								<strong>Група:</strong> {userData.group} <br />
								<strong>Ім`я:</strong> {userData.name} <br />
								<strong>Прізвище:</strong> {userData.surname}
								<br />
								<strong>Email:</strong> {userData.email}
								<br />
								
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>
				<Col md={8}>
					<Card>
						<Card.Body>
							<Card.Title>Ваши курсы и оценки</Card.Title>
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>#</th>
										<th>Название курса</th>
										<th>Оценка</th>
									</tr>
								</thead>
								<tbody>
									{userData.courses.map((course, index) => (
										<tr key={course.id}>
											<td>{index + 1}</td>
											<td>{course.name}</td>
											<td>{course.grade}</td>
										</tr>
									))}
								</tbody>
							</Table>
							<Card.Title>Итоговый рейтинг</Card.Title>
							<Card.Text>
								<strong>Рейтинг:</strong> {userData.finalRating}
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default Account;
