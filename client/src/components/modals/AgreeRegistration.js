import React, { useEffect, useState } from "react";
import {
	Button,
	Form,
	Modal,
	Table,
	FormControl,
	FormSelect,
} from "react-bootstrap";
import {
	fetchAllPreRegistratio,
	AgreeRegistration,
	deletePreRegistrationUser,
} from "../../http/userApi";

const CrateThem = ({ show, onHide }) => {
	const [preRegistrations, setPreRegistrations] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);

	useEffect(() => {
		if(show){fetchAllPreRegistratio().then((data) => setPreRegistrations(data));}
	}, [show]);

	const handleAdd = async () => {
		try {
			console.log("Selected users for registration:", selectedUsers);
			await AgreeRegistration(selectedUsers);
			setSelectedUsers([]);
			onHide();
		} catch (error) {
			console.error("Error registering users:", error);
		}
	};

	const handleDelete = async () => {
		try {
			console.log("Selected users for deletion:", selectedUsers);
			await deletePreRegistrationUser(selectedUsers);
			setSelectedUsers([]);
			onHide();
		} catch (error) {
			console.error("Error deleting users:", error);
		}
	};

	const handleCheckboxChange = (user) => {
		setSelectedUsers((prevSelected) => {
			const isSelected = prevSelected.some(
				(selectedUser) => selectedUser.id === user.id
			);
			if (isSelected) {
				return prevSelected.filter(
					(selectedUser) => selectedUser.id !== user.id
				);
			} else {
				return [...prevSelected, user];
			}
		});
	};

	const handleInputChange = (index, field, value) => {
		const updatedUsers = [...preRegistrations];
		updatedUsers[index][field] = value;
		setPreRegistrations(updatedUsers);

		// Оновіть selectedUsers, якщо користувача вже вибрано
		setSelectedUsers((prevSelected) =>
			prevSelected.map((selectedUser) =>
				selectedUser.id === updatedUsers[index].id
					? { ...selectedUser, [field]: value }
					: selectedUser
			)
		);
	};

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
					Запит на регестрацію
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Table striped bordered hover className="mt-4">
					<thead>
						<tr>
							<th>Вибрати</th>
							<th>Група</th>
							<th>Ім'я</th>
							<th>Прізвище</th>
							<th>Електронна пошта</th>
							<th>Роль</th>
						</tr>
					</thead>
					<tbody>
						{preRegistrations.map((user, index) => (
							<tr key={index}>
								<td>
									<Form.Check
										type="checkbox"
										checked={selectedUsers.some(
											(selectedUser) => selectedUser.id === user.id
										)}
										onChange={() => handleCheckboxChange(user)}
									/>
								</td>
								<td>
									<FormControl
										value={user.group}
										onChange={(e) =>
											handleInputChange(index, "group", e.target.value)
										}
									/>
								</td>
								<td>
									<FormControl
										value={user.name}
										onChange={(e) =>
											handleInputChange(index, "name", e.target.value)
										}
									/>
								</td>
								<td>
									<FormControl
										value={user.surname}
										onChange={(e) =>
											handleInputChange(index, "surname", e.target.value)
										}
									/>
								</td>
								<td>{user.email}</td>
								<td>
									<FormSelect
										value={user.role}
										onChange={(e) =>
											handleInputChange(index, "role", e.target.value)
										}
									>
										<option value="User">User</option>
										<option value="Admin">Admin</option>
									</FormSelect>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="outline-danger"
					onClick={() => {
						handleDelete();
						onHide();
					}}
				>
					видалити
				</Button>
				<Button
					variant="outline-success"
					onClick={() => {
						handleAdd();
						onHide();
					}}
				>
					Додати
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CrateThem;
