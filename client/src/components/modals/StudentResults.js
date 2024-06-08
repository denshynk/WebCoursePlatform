import React, { useEffect, useState } from "react";
import {
	Button,
	Form,
	Modal,
	Table,
} from "react-bootstrap";
import { fetchCourse, fetchAllStudentTestResults } from "../../http/courseApi";

const StudentResults = ({ show, onHide }) => {
	const [courses, setCourses] = useState([]);
	const [users, setUsers] = useState([]);
	const [sortColumn, setSortColumn] = useState("");
	const [sortOrder, setSortOrder] = useState("asc");
	const [searchTerm, setSearchTerm] = useState("");

	const [selectedCourseId, setSelectedCourseId] = useState("");

	useEffect(() => {
		if(show){const fetchCourses = async () => {
			try {
				const data = await fetchCourse();
				setCourses(data);
			} catch (error) {
				console.error("Error fetching courses:", error);
			}
		};

		fetchCourses();}
	}, [show]);

	useEffect(() => {
		if(selectedCourseId){const fetchResults = async () => {
			try {
				const data = await fetchAllStudentTestResults(selectedCourseId);
				setUsers(data);
			} catch (error) {
				console.error("Error fetching Users:", error);
			}
		};
	
		fetchResults();}
	}, [ selectedCourseId]);

	const handleCourseChange = async (e) => {
		const courseId = e.target.value;
		setSelectedCourseId(courseId);
		try {
		} catch (error) {
			console.error("Error fetching paragraphs:", error);
		}
	};

	const handleSort = (column) => {
		const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
		setSortColumn(column);
		setSortOrder(order);
	};

	const sortedUsers = [...users].sort((a, b) => {
		if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
		if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
		return 0;
	});

	const filteredUsers = sortedUsers.filter((user) => {
		// Проверка наличия курса у пользователя
		const hasSelectedCourse = user.user_course?.basket_user_courses.some(
			(course) => course.courseId === parseInt(selectedCourseId)
		);

		// Фильтрация пользователей
		const matchesSearchTerm =
			user.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.studentSurname.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.studentGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.testName.toLowerCase().includes(searchTerm.toLowerCase());

		return !hasSelectedCourse && matchesSearchTerm;
	});

	return (
		<Modal
			show={show}
			onHide={onHide}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Переглянути оцінки за курс студентів
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="formCourseSelect">
						<Form.Label>Select Course</Form.Label>
						<Form.Control
							as="select"
							value={selectedCourseId}
							onChange={handleCourseChange}
						>
							<option value="" disabled>
								Select Course
							</option>
							{courses.map((course) => (
								<option key={course.id} value={course.id}>
									{course.title}
								</option>
							))}
						</Form.Control>
					</Form.Group>{" "}
					{selectedCourseId && (
						<>
							<Form.Group controlId="formSearch">
								<Form.Label>Search Students</Form.Label>
								<Form.Control
									type="text"
									placeholder="Search by name, surname, group, or email"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</Form.Group>
							<Table striped bordered hover className="mt-4">
								<thead>
									<tr>
										<th onClick={() => handleSort("name")}>
											Імя{" "}
											{sortColumn === "name" &&
												(sortOrder === "asc" ? "↑" : "↓")}
										</th>
										<th onClick={() => handleSort("surname")}>
											Прізвище{" "}
											{sortColumn === "surname" &&
												(sortOrder === "asc" ? "↑" : "↓")}
										</th>
										<th onClick={() => handleSort("group")}>
											Група{" "}
											{sortColumn === "group" &&
												(sortOrder === "asc" ? "↑" : "↓")}
										</th>
										<th onClick={() => handleSort("testTitle")}>
											Назва тесту{" "}
											{sortColumn === "testTitle" &&
												(sortOrder === "asc" ? "↑" : "↓")}
										</th>
										<th onClick={() => handleSort("answer")}>
											Відповіді{" "}
											{sortColumn === "answer" &&
												(sortOrder === "asc" ? "↑" : "↓")}
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredUsers.map((user, index) => (
										<tr key={index}>
											<td>{user.studentName}</td>
											<td>{user.studentSurname}</td>
											<td>{user.studentGroup}</td>
											<td>{user.testName}</td>
											<td>{`${user.correctAnswersCount}/${user.totalQuestionsCount}`}</td>
										</tr>
									))}
								</tbody>
							</Table>
						</>
					)}
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="outline-danger" onClick={onHide}>
					Закрити
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default StudentResults;
