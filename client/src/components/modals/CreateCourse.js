import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createCourse } from "../../http/courseApi"; // Переконайтеся, що шлях правильний

const CreateCourse = ({ show, onHide }) => {
	const [courseName, setCourseName] = useState("");

	const handleCreateCourse = async () => {
		try {
			const course = { title: courseName };
			const data = await createCourse(course);
			console.log("Course created successfully:", data);
			// За потреби тут можна додати більше логіки, наприклад показати повідомлення про успіх або очистити форму
			onHide();
		} catch (error) {
			console.error("Error creating course:", error);
			// Обробляйте помилку належним чином, наприклад, показуйте користувачеві повідомлення про помилку
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
