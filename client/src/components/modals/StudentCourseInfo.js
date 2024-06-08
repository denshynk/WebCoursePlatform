import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import {fetchStudentTestResults } from "../../http/courseApi";

const StudentCourseInfo = ({ show, onHide, prevcourseTitle, prevcourseId }) => {
    const [studentTestResults, setStudentTestResults] = useState([]);

 

    useEffect(() => {
       if (show){ const fetchResults = async () => {
        try {
            const results = await fetchStudentTestResults(prevcourseId); // Замените на вашу функцию получения результатов тестов студента
            setStudentTestResults(results);
        } catch (error) {
            console.error("Error fetching student test results:", error);
        }
    };

    fetchResults();}
    }, [show, prevcourseId]);



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
                {studentTestResults && (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Название теста</th>
                                <th>Правильных ответов</th>
                                <th>Всего вопросов</th>
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
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StudentCourseInfo;
