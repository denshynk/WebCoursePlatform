import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { fetchStudentTestResults } from "../../http/courseApi";
import { Line } from "react-chartjs-2";


const StudentCourseInfo = ({ show, onHide, prevcourseTitle, prevcourseId }) => {
	const [studentTestResults, setStudentTestResults] = useState([]);
	const [questions, setQuestions] = useState({});
	const [correctQuestionAnswer, setCorrectQuestionAnswer] = useState({});

	useEffect(() => {
		if (show) {
			const fetchResults = async () => {
				try {
					const { testResults, questionsData, correctAnswersData } =
						await fetchStudentTestResults(prevcourseId);
					setStudentTestResults(testResults);

					setQuestions(questionsData);
					setCorrectQuestionAnswer(correctAnswersData);
				} catch (error) {
					console.error("Error fetching student test results:", error);
				}
			};

			fetchResults();
		}
	}, [show, prevcourseId]);

	const data = {
		labels: Object.keys(questions),
		datasets: [
			{
				label: "Всього питань",
				data: Object.values(questions),
				borderColor: "orange",
				tension: 0.3, // Прямі лінії
				fill: false,
			},
			{
				label: "Правильних відповідей",
				data: Object.values(correctQuestionAnswer),
				borderColor: "blue",
				tension: 0.3, // Прямі лінії
				fill: false,
			},
		],
	};

	const options = {
		scales: {
			x: {
				title: {
					display: true,
					text: "Категорії",
				},
			},
			y: {
				title: {
					display: true,
					text: "Кількість питань",
				},
			},
		},
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
					{prevcourseTitle}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{studentTestResults.length > 0 && (
					<>
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>Назва тесту</th>
									<th>Правильних відповідей</th>
									<th>Усього питань</th>
								</tr>
							</thead>
							<tbody>
								{studentTestResults.map((result) => (
									<tr key={result.testId}>
										<td>{result.testName}</td>
										<td>{result.correctAnswersCount}</td>
										<td>{result.totalQuestionsCount}</td>
									</tr>
								))}
							</tbody>
						</Table>
						<Line data={data} options={options} />
					</>
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

export default StudentCourseInfo;
