import React, { useState, useEffect } from "react";
import { Button, Form, Modal, ListGroup } from "react-bootstrap";
import {
	fetchCourse,
	fetchParagraph,
	updateParagraph,
	deleteParagraph,
	createParagraph,
} from "../../http/courseApi"; // Убедитесь, что путь правильный

const CreateParagraph = ({ show, onHide }) => {
	const [paragraphName, setParagraphName] = useState("");
	const [paragraphText, setParagraphText] = useState("");
	const [courses, setCourses] = useState([]);
	const [paragraphs, setParagraphs] = useState([]);
	const [selectedCourseId, setSelectedCourseId] = useState("");
	const [editingParagraph, setEditingParagraph] = useState(null);
	const [editingName, setEditingName] = useState("");
	const [editingText, setEditingText] = useState("");

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
	}, [show,]);

	useEffect(() => {
		const fetchParagraphsForCourse = async () => {
			try {
				if (selectedCourseId) {
					const data = await fetchParagraph(selectedCourseId);
					setParagraphs(data);
				} else {
					setParagraphs([]);
				}
			} catch (error) {
				console.error("Error fetching paragraphs:", error);
			}
		};

		fetchParagraphsForCourse();
	}, [selectedCourseId]);

	const handleCreateParagraph = async () => {
		try {
			const paragraph = {
				title: paragraphName,
				text: paragraphText,
				courseId: selectedCourseId,
			};
			const data = await createParagraph(paragraph);
			console.log("Paragraph created successfully:", data);
			setParagraphName("");
			setParagraphText("");
			setParagraphs([...paragraphs, data]);
		} catch (error) {
			console.error("Error creating paragraph:", error);
		}
	};

	const handleUpdateParagraph = async () => {
		try {
			const updatedParagraph = {
				...editingParagraph,
				title: editingName,
				text: editingText,
			};

			await updateParagraph(updatedParagraph);
			const data = await fetchParagraph(selectedCourseId);
			setParagraphs(data);
			setEditingParagraph(null);
			setEditingName("");
			setEditingText("");
		} catch (error) {
			console.error("Error updating paragraph:", error);
		}
	};

	const handleDeleteParagraph = async (id) => {
		try {
			console.log(id);
			await deleteParagraph(id);

			setParagraphs(paragraphs.filter((paragraph) => paragraph.id !== id));
		} catch (error) {
			console.error("Error deleting paragraph:", error);
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
					<Form.Group className="d-flex justify-content-end">
						<Button variant="outline-success" onClick={handleCreateParagraph}>
							Додати
						</Button>
					</Form.Group>
				</Form>
				{selectedCourseId && (
					<div className="mt-4">
						<h5>Існуючі параграфи</h5>
						{paragraphs
							.sort((a, b) => a.id - b.id)
							.map((paragraph) => (
								<ListGroup key={paragraph.id}>
									<ListGroup.Item variant="primary">
										{editingParagraph === paragraph ? (
											<Form.Control
												type="text"
												value={editingName}
												onChange={(e) => setEditingName(e.target.value)}
											/>
										) : (
											paragraph.title
										)}
									</ListGroup.Item>
									<ListGroup.Item variant="secondary">
										{editingParagraph === paragraph ? (
											<Form.Control
												as="textarea"
												rows={5}
												value={editingText}
												onChange={(e) => setEditingText(e.target.value)}
												maxLength={10000}
											/>
										) : (
											paragraph.text
										)}
									</ListGroup.Item>
									{editingParagraph === paragraph ? (
										<Button
											variant="outline-success"
											onClick={handleUpdateParagraph}
										>
											Зберегти
										</Button>
									) : (
										<Button
											className="mt-2"
											variant="outline-primary"
											onClick={() => {
												setEditingParagraph(paragraph);
												setEditingName(paragraph.title);
												setEditingText(paragraph.text);
											}}
										>
											Редагувати
										</Button>
									)}
									<Button
										variant="outline-danger"
										onClick={() => handleDeleteParagraph(paragraph.id)}
										className="mt-2 mb-4"
									>
										Видалити
									</Button>
								</ListGroup>
							))}
					</div>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="outline-danger" onClick={onHide}>
					Закрити
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CreateParagraph;
