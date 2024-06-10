import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { fetchTestById, submitTest } from "../../http/courseApi"; // Убедитесь, что путь правильный

const TestModal = ({ show, onHide, testId }) => {
	const [test, setTest] = useState(null);
	const [currentPage, setCurrentPage] = useState("info");
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [testAnswers, setTestAnswers] = useState({});
	const [remainingAttempts, setRemainingAttempts] = useState(null); // Пример для оставшихся попыток
	const [timeLeft, setTimeLeft] = useState();

	useEffect(() => {
		const fetchTest = async () => {
			if (show) {
				try {
					const data = await fetchTestById(parseInt(testId));
					setTest(data.test);
					const atemp = data.test.atemps - data.curentAtemps;
					setRemainingAttempts(atemp);
					setTimeLeft(60);
				} catch (error) {
					console.error("Error fetching test:", error);
				}
			}
		};

		fetchTest();
	}, [show, testId]);

	useEffect(() => {
		let timer;
		if (currentPage === "test" && timeLeft > 0) {
			timer = setInterval(() => {
				setTimeLeft((prevTime) => {
					if (prevTime <= 1) {
						clearInterval(timer);
						handleSubmitTest();
						return 0;
					}
					return prevTime - 1;
				});
			}, 1000);
		}
		return () => clearInterval(timer);
	}, [timeLeft, currentPage]);

	const handleAnswerChange = (questionId, answer) => {
		setTestAnswers((prevAnswers) => ({
			...prevAnswers,
			[questionId]: answer,
		}));
	};

	const handleStartTest = () => {
		setCurrentPage("test");
	};

	const handleNextQuestion = () => {
		if (currentQuestion < test.questions.length - 1) {
			setCurrentQuestion((prevQuestion) => prevQuestion + 1);
		}
	};

	const handleSubmitTest = async () => {
		const finalAnswers = test.questions.reduce((acc, question) => {
			acc[question.id] = testAnswers[question.id] || ""; // Assign empty string if no answer selected
			return acc;
		}, {});
		await submitTest(finalAnswers);
		setTestAnswers({});
		setCurrentQuestion(0);
		setCurrentPage("info");
		onHide();
	};

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
	};

	return (
		<Modal
			show={show}
			onHide={currentPage === "info" ? onHide : null}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			backdrop={currentPage === "info" ? true : "static"}
			keyboard={currentPage === "info"}
		>
			<Modal.Header closeButton={currentPage === "info"}>
				<Modal.Title id="contained-modal-title-vcenter">
					Пройти тест
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{currentPage === "info" && test ? (
					<div className="d-flex flex-column align-items-center mt-5 mb-5">
						<h2>{test.title}</h2>
						<p>Кількість залишившихся спроб: {remainingAttempts}</p>
						<p>Час на тестування: {formatTime(test.time)} хвилин</p>
						<Button
							variant="primary"
							onClick={handleStartTest}
							disabled={remainingAttempts === 0}
						>
							Почати тестування
						</Button>
					</div>
				) : test && test.questions ? (
					<div className="d-flex flex-column">
						<div className="mt-3">
							<div className={`d-flex justify-content-between `}>
								<h2>Питання {currentQuestion + 1}</h2>
								<h2
									className={`${timeLeft <= 60 ? "text-danger" : ""} ${
										timeLeft <= 60 && timeLeft % 2 === 0 ? "blink" : ""
									}`}
								>
									{formatTime(timeLeft)}
								</h2>
							</div>
							<h4 className="mt-3">{test.questions[currentQuestion]?.title}</h4>
							{test.questions[currentQuestion]?.choseAnswer.map(
								(answer, idx) => (
									<div key={idx}>
										<input
											type="radio"
											id={`${currentQuestion}-${idx}`}
											name={`question-${currentQuestion}`}
											value={answer}
											checked={
												testAnswers[test.questions[currentQuestion].id] ===
												answer
											}
											onChange={() =>
												handleAnswerChange(
													test.questions[currentQuestion].id,
													answer
												)
											}
										/>
										<label
											className="ml-2"
											htmlFor={`${currentQuestion}-${idx}`}
										>
											{answer}
										</label>
									</div>
								)
							)}
						</div>
						{currentQuestion === test.questions.length - 1 ? (
							<Button
								className="mt-3"
								variant="primary"
								onClick={handleSubmitTest}
							>
								Завершити тест
							</Button>
						) : (
							<Button
								className="mt-3"
								variant="primary"
								onClick={handleNextQuestion}
							>
								Наступне питання
							</Button>
						)}
					</div>
				) : (
					<div>Loading...</div>
				)}
			</Modal.Body>
			<Modal.Footer>
				{currentPage === "info" && (
					<Button variant="outline-danger" onClick={onHide}>
						Закрити
					</Button>
				)}
			</Modal.Footer>
		</Modal>
	);
};

export default TestModal;
