import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchOneCourse } from "../http/courseApi";

const Course = () => {
	const [course, setCourse] = useState({
		
	});
	const { id } = useParams();

	useEffect(() => {
		fetchOneCourse(id)
			.then((data) => setCourse(data))
			.catch((error) => {
				console.error("Error fetching course:", error);
				// Optionally set course to null or empty object if the fetch fails
				setCourse(null);
			});
console.log(course);
	}, [id]);

	const [selectedTheme, setSelectedTheme] = useState(null);
	const [showTest, setShowTest] = useState(false);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [testAnswers, setTestAnswers] = useState({});
	const [timeLeft, setTimeLeft] = useState(300);
	const [testCompleted, setTestCompleted] = useState(false);

	useEffect(() => {
		let timer;
		if (showTest && timeLeft > 0) {
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
	}, [showTest, timeLeft]);

	useEffect(() => {
		if (testCompleted) {
			const timer = setTimeout(() => {
				setTestCompleted(false);
				setSelectedTheme(null);
			}, 10000);
			return () => clearTimeout(timer);
		}
	}, [testCompleted]);

	const handleThemeClick = (theme) => {
		setSelectedTheme(theme);
		setShowTest(false);
		setCurrentQuestion(0);
		setTestCompleted(false);
		setTestAnswers({});
	};

	const handleStartTest = () => {
		setShowTest(true);
		setTimeLeft(300);
	};

	const handleNextQuestion = () => {
		setCurrentQuestion((prevQuestion) => prevQuestion + 1);
	};

	const handleAnswerChange = (answer) => {
		setTestAnswers((prevAnswers) => ({
			...prevAnswers,
			[currentQuestion]: answer,
		}));
	};

	const handleSubmitTest = () => {
		setShowTest(false);
		setTestCompleted(true);
		const completeAnswers = (selectedTheme?.test || []).map(
			(_, idx) => testAnswers[idx] || ""
		);
		console.log(completeAnswers);
	};

	
	

	return (
		<Container className="mt-3">
			<h1>{course?.title}</h1>
			<Row className="mt-5">
				<Col md={4}>
					<h2>Материал курса</h2>
					{course?.paragraphs?.map((par) => (
						<div key={par.id}>
							<h5 className="mt-3">{par.title}</h5>
							<ul>
								{par?.themes?.map((t) => (
									<li key={t.id}>
										<Button
											style={{ textDecoration: "none", color: "grey" }}
											variant="link"
											onClick={() => handleThemeClick(t)}
										>
											{t.title}
										</Button>
									</li>
								))}
							</ul>
						</div>
					))}
				</Col>
				<Col md={8}>
					{selectedTheme && !showTest && !testCompleted && (
						<div>
							<h1>{selectedTheme.title}</h1>
							<p>{selectedTheme.description}</p>
							{selectedTheme?.text
								?.sort((a, b) => a.number - b.number)
								?.map((txt) => (
									<div key={txt.id}>
										<h2>{txt.title}</h2>
										<p>{txt.maintext}</p>
									</div>
								))}
							<Button variant="primary" onClick={handleStartTest}>
								Пройти тест
							</Button>
						</div>
					)}
					{showTest && currentQuestion < (selectedTheme?.test || []).length && (
						<div className="mt-3">
							<h2>Питання {currentQuestion + 1}</h2>
							<h4 className="mt-3">
								{selectedTheme?.test[currentQuestion]?.title}
							</h4>
							{selectedTheme?.test[currentQuestion]?.choseAnswer?.map(
								(answer, idx) => (
									<div key={idx}>
										<input
											type="radio"
											id={`${currentQuestion}-${idx}`}
											name={`${currentQuestion}`}
											value={answer}
											checked={testAnswers[currentQuestion] === answer}
											onChange={() => handleAnswerChange(answer)}
										/>
										<label
											className="ml-2 mt-3"
											htmlFor={`${currentQuestion}-${idx}`}
										>
											{answer}
										</label>
									</div>
								)
							)}
							{currentQuestion === selectedTheme.test.length - 1 ? (
								<Button
									className="mt-3"
									variant="primary"
									onClick={handleSubmitTest}
								>
									Завершить тест
								</Button>
							) : (
								<Button
									className="mt-3"
									variant="primary"
									onClick={handleNextQuestion}
								>
									Далее
								</Button>
							)}
						</div>
					)}
					{showTest && (
						<div className="mt-3">
							<h4>
								Время до конца теста: {Math.floor(timeLeft / 60)}:
								{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
							</h4>
						</div>
					)}
					{testCompleted && (
						<div>
							<h2>Тест завершен</h2>
							<p>Ваши ответы были отправлены.</p>
						</div>
					)}
				</Col>
			</Row>
		</Container>
	);
};

export default Course;
