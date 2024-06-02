import React, { useState, useEffect } from "react";
import { Button, Form, Modal, ListGroup } from "react-bootstrap";
import {
	createTheme,
	fetchCourse,
	fetchParagraph,
	fetchTheme,
	updateTheme,
	deleteTheme,
	updateText,
	deleteText,
} from "../../http/courseApi";

const CreateTheme = ({ show, onHide }) => {
	const [themeTitle, setThemeTitle] = useState("");
	const [themeText, setThemeText] = useState("");

	const [courses, setCourses] = useState([]);
	const [selectedCourseId, setSelectedCourseId] = useState("");
	const [selectedParagraphId, setSelectedParagraphId] = useState("");
	const [selectedThemeId, setSelectedThemeId] = useState();
	const [selectedThemeTextes, setSelectedThemeTexts] = useState([]);

	const [paragraphs, setParagraphs] = useState([]);
	const [themes, setThemes] = useState([]);
	const [texts, setTexts] = useState([]);
	const [isCreatingNewTheme, setIsCreatingNewTheme] = useState(false);
	const [isEditingTheme, setIsEditingTheme] = useState(false);

	const [editingTheme, setEditingTheme] = useState(null);
	const [editingThemeTitle, setEditingThemeTitle] = useState("");
	const [editingThemeText, setEditingThemeText] = useState("");

	const [editingText, setEditingText] = useState(null);
	const [editingTextNumber, setEditingTextNumber] = useState("");
	const [editingTextTitle, setEditingTextTitle] = useState("");
	const [editingTextText, setEditingTextText] = useState("");

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const data = await fetchCourse();
				setCourses(data);
			} catch (error) {
				console.error("Error fetching courses:", error);
			}
		};
		if (show) fetchCourses();
	}, [show]);

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

	useEffect(() => {
		const fetchThemesForParagraph = async () => {
			try {
				if (selectedParagraphId) {
					const data = await fetchTheme(selectedParagraphId);
					setThemes(data);
				} else {
					setThemes([]);
				}
			} catch (error) {
				console.error("Error fetching paragraphs:", error);
			}
		};
		fetchThemesForParagraph();
	}, [selectedParagraphId]);

	const handleAddText = () => {
		const newNumber = texts.length + 1;
		setTexts([...texts, { title: "", content: "", number: newNumber }]);
	};

	const handleRemoveText = (index) => {
		const updatedTexts = [...texts];
		updatedTexts.splice(index, 1);
		setTexts(updatedTexts);
	};

	const handleAddCurentText = () => {
		const maxNumber = selectedThemeTextes.reduce((max, text) => {
			return text.number > max ? text.number : max;
		}, 0);
		const newNumber = maxNumber + 1;

		setSelectedThemeTexts([
			...selectedThemeTextes,
			{
				title: "",
				text: "",
				number: newNumber,
				themeId: parseInt(selectedThemeId),
			},
		]);
	};

	const handleRemoveCurentText = (index) => {
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
			const data = await createTheme(theme);
			console.log("Theme created successfully:", data);
			onHide();
		} catch (error) {
			console.error("Error creating theme:", error);
		}
	};

	const handleUpdateTheme = async () => {
		try {
			const updatedTheme = {
				id: selectedThemeId,
				title: editingThemeTitle,
				description: editingThemeText,
				paragraphId: selectedParagraphId,
			};
			await updateTheme(updatedTheme);
			console.log("Theme updated successfully");
		} catch (error) {
			console.error("Error updating theme:", error);
		}
	};

	const handleUpdateText = async () => {
		try {
			const updatedText = {
				...editingText,
				title: editingTextTitle,
				text: editingTextText,
				number: parseInt(editingTextNumber),
			};

			await updateText(updatedText);
			const data = await fetchTheme(selectedParagraphId);
			setThemes(data);
			const selectedTheme = themes.find(
				(theme) => theme.id === parseInt(selectedThemeId)
			);
			setSelectedThemeTexts(selectedTheme.them_texts);

			console.log(selectedThemeTextes);
			setEditingText(null);
			setEditingTextTitle("");
			setEditingTextText("");
		} catch (error) {
			console.error("Error updating paragraph:", error);
		}
	};

	const handleDeleteTheme = async () => {
		try {
			await deleteTheme(selectedThemeId);
			console.log("Theme deleted successfully");
			setSelectedThemeId("");
			setThemeTitle("");
			setThemeText("");
			setTexts([]);
			onHide();
		} catch (error) {
			console.error("Error deleting theme:", error);
		}
	};

	const handleDeleteText = async (id) => {
		try {
			await deleteText(id);
			setSelectedThemeTexts(
				selectedThemeTextes.filter((text) => text.id !== id)
			);
		} catch (error) {
			console.error("Error deleting text:", error);
		}
	};

	const handleThemeSelect = (e) => {
		const themeId = e.target.value;
		setSelectedThemeId(themeId);
		const selectedTheme = themes.find(
			(theme) => theme.id === parseInt(themeId)
		);
		if (selectedTheme) {
			setSelectedThemeTexts(selectedTheme.them_texts);
		} else {
			setSelectedThemeTexts([]);
		}
	};

	const resetForm = () => {
		setThemeTitle("");
		setThemeText("");
		setTexts([]);
		setSelectedThemeId("");
		setIsCreatingNewTheme(false);
		setIsEditingTheme(false);
	};

	return (
		<Modal
			show={show}
			onHide={() => {
				resetForm();
				onHide();
			}}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Create or Edit Theme
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="formCourseSelect">
						<Form.Label>Select Course</Form.Label>
						<Form.Control
							as="select"
							value={selectedCourseId}
							onChange={(e) => setSelectedCourseId(e.target.value)}
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
					{selectedParagraphId && (
						<>
							<Form.Check
								type="radio"
								label="Create New Theme"
								name="themeOption"
								id="createNewTheme"
								className="mt-3"
								checked={isCreatingNewTheme}
								onChange={() => {
									setIsCreatingNewTheme(true);
									setIsEditingTheme(false);
								}}
							/>
							{themes.length > 0 && (
								<Form.Check
									type="radio"
									label="Edit or Delete Existing Theme"
									name="themeOption"
									id="editExistingTheme"
									className="mt-2"
									checked={isEditingTheme}
									onChange={() => {
										setIsEditingTheme(true);
										setIsCreatingNewTheme(false);
										setTexts([]);
									}}
								/>
							)}
						</>
					)}
					{isCreatingNewTheme && (
						<>
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
								<div className="text-muted text-right">
									{themeText.length}/5000
								</div>
							</Form.Group>
							{texts.length === 0 && (
								<Button variant="outline-primary" onClick={handleAddText}>
									Add Text
								</Button>
							)}

							{texts.map((text, index) => (
								<div key={index}>
									<Form.Group
										controlId={`formTextTitle${index}`}
										className="mt-3"
									>
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
										<div className="text-muted text-right">
											{text.content.length}/2500
										</div>
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
						</>
					)}

					{isEditingTheme && (
						<>
							<Form.Group controlId="formThemeSelect" className="mt-3">
								<Form.Label>Select Theme</Form.Label>
								<Form.Control
									as="select"
									value={selectedThemeId}
									onChange={handleThemeSelect}
								>
									<option value="" disabled>
										Select Theme
									</option>
									{themes.map((theme) => (
										<option key={theme.id} value={theme.id}>
											{theme.title}
										</option>
									))}
								</Form.Control>
							</Form.Group>
							{selectedThemeId && (
								<>
									<h5 className="mt-4">Тема</h5>
									{themes

										.filter((theme) => theme.id === parseInt(selectedThemeId))

										.map((theme) => (
											<ListGroup key={theme.id}>
												<ListGroup>
													<ListGroup.Item variant="primary">
														{editingTheme === theme ? (
															<Form.Control
																type="text"
																value={editingThemeTitle}
																onChange={(e) =>
																	setEditingThemeTitle(e.target.value)
																}
															/>
														) : (
															theme.title
														)}
													</ListGroup.Item>
													<ListGroup.Item variant="primary">
														{editingTheme === theme ? (
															<Form.Control
																as="textarea"
																rows={5}
																value={editingThemeText}
																onChange={(e) =>
																	setEditingThemeText(e.target.value)
																}
															/>
														) : (
															theme.description
														)}
													</ListGroup.Item>
												</ListGroup>
												<Modal.Footer
													style={{
														border: "0",
														paddingTop: "0",
														justifyContent: "start",
													}}
												>
													{editingTheme === theme ? (
														<Button
															variant="outline-success"
															onClick={handleUpdateTheme}
														>
															Зберегти
														</Button>
													) : (
														<Button
															variant="outline-primary"
															onClick={() => {
																setEditingTheme(theme);
																setEditingThemeTitle(theme.title);
																setEditingThemeText(theme.description);

																setEditingText(null);
															}}
														>
															Редагувати
														</Button>
													)}
												</Modal.Footer>

												<h6 className="mt-2 ">Тексти</h6>

												{selectedThemeTextes
													.sort((a, b) => a.number - b.number)
													.map((text) => (
														<div>
															<ListGroup className="mb-2" key={text.id}>
																<ListGroup.Item>
																	{editingText === text ? (
																		<Form.Control
																			type="number"
																			value={editingTextNumber}
																			onChange={(e) =>
																				setEditingTextNumber(e.target.value)
																			}
																		/>
																	) : (
																		text.number
																	)}
																</ListGroup.Item>
																<ListGroup.Item>
																	{editingText === text ? (
																		<Form.Control
																			type="text"
																			value={editingTextTitle}
																			onChange={(e) =>
																				setEditingTextTitle(e.target.value)
																			}
																		/>
																	) : (
																		text.title
																	)}
																</ListGroup.Item>
																<ListGroup.Item>
																	{editingText === text ? (
																		<Form.Control
																			as="textarea"
																			rows={5}
																			value={editingTextText}
																			onChange={(e) =>
																				setEditingTextText(e.target.value)
																			}
																		/>
																	) : (
																		text.text
																	)}
																</ListGroup.Item>
															</ListGroup>
															<Modal.Footer
																style={{
																	border: "0",
																	paddingTop: "0",
																	justifyContent: "start",
																}}
															>
																{editingText === text ? (
																	<Button
																		variant="outline-success"
																		onClick={handleUpdateText}
																	>
																		Зберегти
																	</Button>
																) : (
																	<Button
																		variant="outline-primary"
																		onClick={() => {
																			setEditingText(text);
																			setEditingTextTitle(text.title);
																			setEditingTextText(text.text);
																			setEditingTextNumber(text.number);
																			setEditingTheme(null);
																		}}
																	>
																		Редагувати
																	</Button>
																)}
																<Button
																	variant="outline-danger"
																	onClick={() => handleDeleteText(text.id)}
																>
																	Видалити
																</Button>
															</Modal.Footer>
														</div>
													))}
											</ListGroup>
										))}
								</>
							)}
						</>
					)}
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="outline-danger"
					onClick={() => {
						resetForm();
						onHide();
					}}
				>
					Close
				</Button>
				{isCreatingNewTheme ? (
					<Button variant="outline-success" onClick={handleCreateTheme}>
						Add
					</Button>
				) : (
					<>
						<Button variant="outline-danger" onClick={handleDeleteTheme}>
							Delete
						</Button>
						<Button
							className="mt-2"
							variant="outline-primary"
							onClick={handleAddCurentText}
						>
							Add Text
						</Button>
					</>
				)}
			</Modal.Footer>
		</Modal>
	);
};

export default CreateTheme;
