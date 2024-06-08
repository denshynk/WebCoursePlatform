import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {
	fetchCourse,
	fetchParagraph,
	createTest,
	fetchTheme,
	fetchQuestionCategory,
} from "../../http/courseApi";

const CreateTest = ({ show, onHide }) => {
	const [courses, setCourses] = useState([]);
	const [paragraphs, setParagraphs] = useState([]);
	const [themes, setThemes] = useState([]);
	const [questionCategory, setQuestionCategory] = useState([]);

	const [selectedCourseId, setSelectedCourseId] = useState("");
	const [selectedThemeId, setSelectedThemeId] = useState("");
	const [selectedParagraphId, setSelectedParagraphId] = useState("");


	const [testAtemps, setTestAtemps] = useState("");
	const [testTime, setTestTime] = useState("");
	const [testTitle, setTestTitle] = useState("");
	const [questions, setQuestions] = useState([
		{
			question: "",
			answers: ["", "", ""],
			correctAnswerIndex: null,
			correctAnswer: "",
			categoryId: "",
		},
	]);

	useEffect(() => {
	if(show){	const fetchCourses = async () => {
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
		if(show){const fetchQuestionCategories = async () => {
			try {
				const data = await fetchQuestionCategory();
				setQuestionCategory(data);
			} catch (error) {
				console.error("Error fetching test categories:", error);
			}
		};

		fetchQuestionCategories();}
	}, [show]);

	const handleCourseChange = async (e) => {
		const courseId = e.target.value;
		setSelectedCourseId(courseId);
		try {
			const data = await fetchParagraph(courseId);
			setParagraphs(data);
			setSelectedParagraphId(""); // Reset paragraph selection when course changes
			setThemes([]); // Reset themes when course changes
		} catch (error) {
			console.error("Error fetching paragraphs:", error);
		}
	};

	const handleParagraphChange = async (e) => {
		const paragraphId = e.target.value;
		setSelectedParagraphId(paragraphId);
		try {
			const data = await fetchTheme(paragraphId);
			setThemes(data);
		} catch (error) {
			console.error("Error fetching themes:", error);
		}
	};

	const handleAddQuestion = () => {
		setQuestions([
			...questions,
			{
				question: "",
				answers: ["", "", ""],
				correctAnswerIndex: null,
				correctAnswer: "",
				categoryId: "",
			},
		]);
	};

	const handleRemoveQuestion = (index) => {
		const updatedQuestions = [...questions];
		if (updatedQuestions.length > 1) {
			updatedQuestions.splice(index, 1);
			setQuestions(updatedQuestions);
		}
	};

	const handleQuestionChange = (index, value) => {
		const updatedQuestions = [...questions];
		updatedQuestions[index].question = value;
		setQuestions(updatedQuestions);
	};

	const handleAddAnswer = (questionIndex) => {
		const updatedQuestions = [...questions];
		if (updatedQuestions[questionIndex].answers.length < 10) {
			updatedQuestions[questionIndex].answers.push("");
			setQuestions(updatedQuestions);
		}
	};

	const handleRemoveAnswer = (questionIndex, answerIndex) => {
		const updatedQuestions = [...questions];
		if (updatedQuestions[questionIndex].answers.length > 3) {
			updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
			setQuestions(updatedQuestions);
		}
	};

	const handleAnswerChange = (questionIndex, answerIndex, value) => {
		const updatedQuestions = [...questions];
		updatedQuestions[questionIndex].answers[answerIndex] = value;
		setQuestions(updatedQuestions);
	};

	const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
		const updatedQuestions = [...questions];
		updatedQuestions[questionIndex].correctAnswerIndex = answerIndex;
		updatedQuestions[questionIndex].correctAnswer =
			updatedQuestions[questionIndex].answers[answerIndex];
		setQuestions(updatedQuestions);
	};

	const handleCategoryChange = (questionIndex, value) => {
		const updatedQuestions = [...questions];
		updatedQuestions[questionIndex].categoryId = value;
		setQuestions(updatedQuestions);
	};

	const handleCreateTest = async () => {
		try {
			const test = {
				title: testTitle,
				atemps: testAtemps,
				time: testTime,
				themeId: selectedThemeId,
				questions: questions.map((q) => ({
					...q,
					correctAnswer: q.answers[q.correctAnswerIndex],
				})),
			};
			const data = await createTest(test);
			console.log("Test created successfully:", data);
			// onHide();
		} catch (error) {
			console.error("Error creating test:", error);
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
					Create Test
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
							onChange={handleParagraphChange}
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
					<Form.Group className="mt-2" controlId="formThemeSelect">
						<Form.Label>Select Theme</Form.Label>
						<Form.Control
							as="select"
							value={selectedThemeId}
							onChange={(e) => setSelectedThemeId(e.target.value)}
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

					<Form.Label className="mt-2">Test Title</Form.Label>
					<Form.Control
						placeholder="Test Title"
						value={testTitle}
						onChange={(e) => setTestTitle(e.target.value)}
					/>
					<Form.Label className="mt-2">
						Час на проходження(в секундах)
					</Form.Label>
					<Form.Control
						type="number"
						placeholder="Час на проходження"
						value={testTime}
						onChange={(e) => setTestTime(e.target.value)}
					/>
					<Form.Label className="mt-2">Кількість спроб</Form.Label>
					<Form.Control
						type="number"
						placeholder="Кількість спроб"
						value={testAtemps}
						onChange={(e) => setTestAtemps(e.target.value)}
					/>
					{questions.map((question, qIndex) => (
						<div key={qIndex} className="mt-4">
							<Form.Label>Question {qIndex + 1}</Form.Label>

							<div className="d-flex align-items-center">
								<Form.Control
									placeholder="Question"
									value={question.question}
									onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
								/>
								<Button
									variant="outline-danger"
									onClick={() => handleRemoveQuestion(qIndex)}
									className="ms-2"
									disabled={questions.length <= 1}
								>
									-
								</Button>
							</div>
							<Form.Group className="mt-2" controlId="formCategorySelect">
								<Form.Label>Select Category</Form.Label>
								<Form.Control
									as="select"
									value={question.categoryId}
									onChange={(e) => handleCategoryChange(qIndex, e.target.value)}
								>
									<option value="" disabled>
										Select Category
									</option>
									{questionCategory.map((category) => (
										<option key={category.id} value={category.id}>
											{category.CategoryName}
										</option>
									))}
								</Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label className="mt-2">Answers</Form.Label>
								{question.answers.map((answer, aIndex) => (
									<div key={aIndex} className="d-flex align-items-center mt-2">
										<Form.Check
											type="radio"
											name={`answerOption${qIndex}`} // Уникальное имя для каждой группы радио-кнопок
											id={`answer-${qIndex}-${aIndex}`} // Уникальный id для каждой радио-кнопки
											checked={question.correctAnswerIndex === aIndex} // Проверяем, выбран ли текущий ответ
											onChange={() => handleCorrectAnswerChange(qIndex, aIndex)}
										/>
										<Form.Control
											className="ml-3"
											type="text"
											placeholder={`Answer ${aIndex}`}
											value={answer}
											onChange={(e) =>
												handleAnswerChange(qIndex, aIndex, e.target.value)
											}
										/>
										<Button
											variant="outline-danger"
											onClick={() => handleRemoveAnswer(qIndex, aIndex)}
											className="ms-2"
											disabled={question.answers.length <= 3}
										>
											-
										</Button>
									</div>
								))}
								{question.answers.length < 10 && (
									<Button
										variant="outline-success"
										onClick={() => handleAddAnswer(qIndex)}
										className="mt-2"
									>
										+ Add Answer
									</Button>
								)}
							</Form.Group>
						</div>
					))}
					<Button
						variant="outline-success"
						onClick={handleAddQuestion}
						className="mt-4"
					>
						+ Add Question
					</Button>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="outline-danger" onClick={onHide}>
					Close
				</Button>
				<Button variant="outline-success" onClick={handleCreateTest}>
					Add
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CreateTest;
