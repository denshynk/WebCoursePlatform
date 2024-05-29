import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createTheme, fetchCourse, fetchParagraph } from "../../http/courseApi";

const CreateTheme = ({ show, onHide }) => {
	const [themeTitle, setThemeTitle] = useState("");
	const [themeText, setThemeText] = useState("");
	const [courses, setCourses] = useState([]);
	const [selectedCourseId, setSelectedCourseId] = useState("");
	const [selectedParagraphId, setSelectedParagraphId] = useState("");
	const [paragraphs, setParagraphs] = useState([]);
	const [texts, setTexts] = useState([]);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const data = await fetchCourse();
				setCourses(data);
			} catch (error) {
				console.error("Error fetching courses:", error);
			}
		};

		fetchCourses();
	}, []);

	const handleCourseChange = async (e) => {
		const courseId = e.target.value;
		setSelectedCourseId(courseId);
		try {
			const data = await fetchParagraph(courseId);
			setParagraphs(data);
		} catch (error) {
			console.error("Error fetching paragraphs:", error);
		}
	};

	const handleAddText = () => {
		const newNumber = texts.length + 1;
		setTexts([...texts, { title: "", content: "", number: newNumber }]);
	};

	const handleRemoveText = (index) => {
		const updatedTexts = [...texts];
		updatedTexts.splice(index, 1);
		setTexts(updatedTexts);
	};

	const handleCreateTheme = async () => {
		try {
			const theme = {
				title: themeTitle,
				text: themeText,
				paragraphId: selectedParagraphId,
				texts: texts,
			};
			console.log(theme);
			const data = await createTheme(theme);
			console.log("Theme created successfully:", data);
			onHide();
		} catch (error) {
			console.error("Error creating theme:", error);
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
					Create Theme
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
					</Form.Group>
					<Form.Group className="mt-2" controlId="formParagraphSelect">
						<Form.Label>Select Paragraph</Form.Label>
						<Form.Control
							as="select"
							value={selectedParagraphId}
							onChange={(e) => setSelectedParagraphId(e.target.value)}
						>
							<option value="" disabled>
								Select Paragraph
							</option>
							{paragraphs.map((paragraph) => (
								<option key={paragraph.id} value={paragraph.id}>
									{paragraph.title}
								</option>
							))}
						</Form.Control>
					</Form.Group>
					<Form.Label className="mt-2">Theme Title</Form.Label>
					<Form.Control
						placeholder="Theme Title"
						value={themeTitle}
						onChange={(e) => setThemeTitle(e.target.value)}
					/>

					<Form.Group controlId="formThemeText" className="mt-3">
						<Form.Label>Theme Text</Form.Label>
						<Form.Control
							as="textarea"
							rows={5}
							value={themeText}
							onChange={(e) => setThemeText(e.target.value)}
							maxLength={5000}
						/>
						<div className="text-muted text-right">{themeText.length}/5000</div>
					</Form.Group>
					{texts.length === 0 && (
						<Button variant="outline-primary" onClick={handleAddText}>
							Add Text
						</Button>
					)}

					{texts.map((text, index) => (
						<div key={index}>
							<Form.Group controlId={`formTextTitle${index}`} className="mt-3">
								<Form.Label>Text Title</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter title"
									value={text.title}
									onChange={(e) => {
										const updatedTexts = [...texts];
										updatedTexts[index].title = e.target.value;
										setTexts(updatedTexts);
									}}
								/>
							</Form.Group>
							<Form.Group
								controlId={`formTextContent${index}`}
								className="mt-3"
							>
								<Form.Label>Text Content</Form.Label>
								<Form.Control
									as="textarea"
									rows={5}
									placeholder="Enter content"
									value={text.content}
									maxLength={2500}
									onChange={(e) => {
										const updatedTexts = [...texts];
										updatedTexts[index].content = e.target.value;
										setTexts(updatedTexts);
									}}
								/>
								<div className="text-muted text-right"></div>
							</Form.Group>
							<Modal.Footer className="d-flex justify-content-start">
								{texts.length > 0 && (
									<Button
										className="mt-2"
										variant="outline-danger"
										onClick={() => handleRemoveText(index)}
									>
										Remove Text
									</Button>
								)}
								{index === texts.length - 1 && (
									<Button
										className="mt-2"
										variant="outline-primary"
										onClick={handleAddText}
									>
										Add Text
									</Button>
								)}
							</Modal.Footer>
						</div>
					))}
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="outline-danger" onClick={onHide}>
					Close
				</Button>
				<Button variant="outline-success" onClick={() => handleCreateTheme}>
					Add
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CreateTheme;
