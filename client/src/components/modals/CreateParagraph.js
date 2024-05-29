import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createParagraph, fetchCourse } from "../../http/courseApi"; // Make sure the path is correct

const CreateParagraph = ({ show, onHide }) => {
	const [paragraphName, setParagraphName] = useState("");
	const [paragraphText, setParagraphText] = useState("");
	const [courses, setCourses] = useState([]);
	const [selectedCourseId, setSelectedCourseId] = useState("");

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const data = await fetchCourse();
				setCourses(data);
			} catch (error) {
				console.error("Error fetching courses:", error);
			}
		};

		if (show) {
			fetchCourses();
		}
	}, [show]);

	const handleCreateParagraph = async () => {
		try {
			const paragraph = {
				title: paragraphName,
				text: paragraphText,
				courseId: selectedCourseId,
			};
			const data = await createParagraph(paragraph);
			console.log("Paragraph created successfully:", data);
			onHide();
		} catch (error) {
			console.error("Error creating paragraph:", error);
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
					Створити Параграф
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="formCourseSelect">
						<Form.Label>Виберіть курс</Form.Label>
						<Form.Control
							as="select"
							value={selectedCourseId}
							onChange={(e) => setSelectedCourseId(e.target.value)}
						>
							<option value="" disabled>
								Виберіть курс
							</option>
							{courses.map((course) => (
								<option key={course.id} value={course.id}>
									{course.title}
								</option>
							))}
						</Form.Control>
					</Form.Group>
					<Form.Control
						className="mt-3"
						placeholder={"Назва параграфу"}
						value={paragraphName}
						onChange={(e) => setParagraphName(e.target.value)}
					/>
					<Form.Group controlId="formParagraphText" className="mt-3">
						<Form.Label>Текст параграфу</Form.Label>
						<Form.Control
							as="textarea"
							rows={5}
							value={paragraphText}
							onChange={(e) => setParagraphText(e.target.value)}
							maxLength={10000}
						/>
						<div className="text-muted text-right">
							{paragraphText.length}/10000
						</div>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="outline-danger" onClick={onHide}>
					Закрити
				</Button>
				<Button variant="outline-success" onClick={handleCreateParagraph}>
					Додати
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CreateParagraph;
