import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchOneCourse } from "../http/courseApi";
import TestModal from "../components/modals/TestModal";

const Course = () => {
	const [course, setCourse] = useState({});
	const { id } = useParams();

	useEffect(() => {
		fetchOneCourse(id)
			.then((data) => setCourse(data))
			.catch((error) => {
				console.error("Error fetching course:", error);
				// Optionally set course to null or empty object if the fetch fails
				setCourse(null);
			});
	}, [id]);

	const [selectedTheme, setSelectedTheme] = useState(null);
	const [showTest, setShowTest] = useState(false);
	const [testAnswers, setTestAnswers] = useState({});
	const [testCompleted, setTestCompleted] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [selectedTest, setSelectedTest] = useState(null);


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
		setTestCompleted(false);
		setTestAnswers({});
		setSelectedParagraph(null);
	};

	const [selectedParagraph, setSelectedParagraph] = useState(null);

	const handleParagraphClick = (paragraphId) => {
		setSelectedParagraph(paragraphId);
		setSelectedTheme(null);
	};

	return (
		<Container className="mt-3">
			<h1>{course?.title}</h1>
			<Row className="mt-5">
				<Col md={4}>
					<h2>Матеріал курсу</h2>
					{course?.paragraphs
						?.sort((a, b) => a.id - b.id)
						?.map((par) => (
							<div key={par.id}>
								<h5
									className="mt-3"
									style={{ cursor: "pointer" }}
									onClick={() => handleParagraphClick(par.id)}
								>
									{par.title}
								</h5>
								<ul>
									{par?.themes
										?.sort((a, b) => a.id - b.id)
										?.map((t) => (
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
					{selectedParagraph && (
						<div>
							<h1>
								{
									course?.paragraphs.find((par) => par.id === selectedParagraph)
										?.title
								}
							</h1>
							<p>
								{
									course?.paragraphs.find((par) => par.id === selectedParagraph)
										?.text
								}
							</p>
						</div>
					)}
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
							{selectedTheme?.them_texts
								?.sort((a, b) => a.number - b.number)
								?.map((them_texts) => (
									<div key={them_texts.id}>
										<h2>{them_texts.title}</h2>
										<p>{them_texts.text}</p>
									</div>
								))}
							{selectedTheme && !showTest && !testCompleted && (
								<div>
									{selectedTheme?.tests?.map((test, index) => (
										<div key={test.id}>
											<Button
												className="m-2"
												variant="primary"
												onClick={() => {
													setOpenModal(true);
													setSelectedTest(test.id);
												}}
											>
												Пройти тест {`${index + 1}`}
											</Button>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</Col>
			</Row>
			<TestModal
				show={openModal}
				testId={selectedTest}
				onHide={() => setOpenModal(false)}
			/>
		</Container>
	);
};

export default Course;
