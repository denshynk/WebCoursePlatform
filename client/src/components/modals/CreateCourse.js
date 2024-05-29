import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createCourse } from "../../http/courseApi"; // Make sure the path is correct

const CreateCourse = ({ show, onHide }) => {
	const [courseName, setCourseName] = useState("");

	const handleCreateCourse = async () => {
		try {
			const course = { title: courseName };
			const data = await createCourse(course);
			console.log("Course created successfully:", data);
			// You can add more logic here if needed, such as showing a success message or clearing the form
			onHide();
		} catch (error) {
			console.error("Error creating course:", error);
			// Handle error appropriately, e.g., show an error message to the user
		}
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
					Створити Курс
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Control
						placeholder={"Назва курсу"}
						value={courseName}
						onChange={(e) => setCourseName(e.target.value)}
					/>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="outline-danger" onClick={onHide}>
					Закрити
				</Button>
				<Button variant="outline-success" onClick={handleCreateCourse}>
					Додати
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CreateCourse;
