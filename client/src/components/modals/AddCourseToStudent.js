import React, { useEffect, useState } from "react";
import {
	Button,
	Form,
	FormCheck,
	FormControl,
	Modal,
	Table,
} from "react-bootstrap";
import { fetchCourse } from "../../http/courseApi";

import { fetchAllUsers, addUserToCours } from "../../http/userApi";

const AddCourseToStudent = ({ show, onHide }) => {
	const [courses, setCourses] = useState([]);
	const [users, setUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [sortColumn, setSortColumn] = useState("");
	const [sortOrder, setSortOrder] = useState("asc");
	const [searchTerm, setSearchTerm] = useState("");

	const [selectedCourseId, setSelectedCourseId] = useState("");

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const data = await fetchCourse();
				setCourses(data);
				console.log(users.user_course);
			} catch (error) {
				console.error("Error fetching courses:", error);
			}
		};

		fetchCourses();
	}, []);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const data = await fetchAllUsers();
				setUsers(data);
				
			} catch (error) {
				console.error("Error fetching Users:", error);
			}
		};

		fetchUsers();
	}, []);

	const handleCourseChange = async (e) => {
		const courseId = e.target.value;
		setSelectedCourseId(courseId);
		try {
		} catch (error) {
			console.error("Error fetching paragraphs:", error);
		}
	};

	const handleUserSelect = (userId) => {
		users.filter((id) => id === userId).map(user => console.log(user))
		
		setSelectedUsers((prevSelected) =>
			prevSelected.includes(userId)
				? prevSelected.filter((id) => id !== userId)
				: [...prevSelected, userId]
		);
	};

	const handelAddUsersToCourse = async () => {
		try {
			const courseUsers = {
				courseId: selectedCourseId,
				usersId: selectedUsers,
			};
			console.log(courseUsers);
			const data = await addUserToCours(courseUsers);
			console.log("User successfully add to course", data);
		} catch (error) {
			console.error("Error add Users to course:", error);
		}
	};

	 const handleSort = (column) => {
			const order =
				sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
			setSortColumn(column);
			setSortOrder(order);
		};

	  const sortedUsers = [...users].sort((a, b) => {
			if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
			if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});

		const filteredUsers = sortedUsers.filter(
			(user) =>
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase())
		);

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
					Створити Курс
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
								<th>Выбрать</th>
								<th onClick={() => handleSort("group")}>
									Группа{" "}
									{sortColumn === "group" && (sortOrder === "asc" ? "↑" : "↓")}
								</th>
								<th onClick={() => handleSort("name")}>
									Имя{" "}
									{sortColumn === "name" && (sortOrder === "asc" ? "↑" : "↓")}
								</th>
								<th onClick={() => handleSort("surname")}>
									Фамилия{" "}
									{sortColumn === "surname" &&
										(sortOrder === "asc" ? "↑" : "↓")}
								</th>
								<th onClick={() => handleSort("email")}>
									Email{" "}
									{sortColumn === "email" && (sortOrder === "asc" ? "↑" : "↓")}
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.map((user) => (
								<tr key={user.id}>
									<td>
										<FormCheck
											type="checkbox"
											checked={selectedUsers.includes(user.id)}
											onChange={() => handleUserSelect(user.id)}
										/>
									</td>
									<td>{user.group}</td>
									<td>{user.name}</td>
									<td>{user.surname}</td>
									<td>{user.email}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="outline-danger" onClick={onHide}>
					Закрити
				</Button>
				<Button variant="outline-success" onClick={handelAddUsersToCourse}>
					Додати
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AddCourseToStudent;
