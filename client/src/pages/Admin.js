import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import AddCourseToStudent from "../components/modals/AddCourseToStudent";
import CreateCourse from "../components/modals/CreateCourse";
import CreateParagraph from "../components/modals/CreateParagraph";
import CrateThem from "../components/modals/CrateThem";
import CreateTest from "../components/modals/CreateTest";
import AgreeRegistration from "../components/modals/AgreeRegistration";

const Admin = () => {
	const [addCourseToStudentVisable, setAddCourseToStudentVisable] =
		useState(false);
	const [courseVisable, setCourseVisable] = useState(false);
	const [paragraphVisable, setParagraphVisable] = useState(false);
	const [themVisable, setThemVisable] = useState(false);
	const [testVisable, setTestVisable] = useState(false);
	const [successRegistration, setSuccessRegistration] = useState(false);
	return (
		<Container>
			<Row className="mt-3">
				<Col className="mt-3 d-flex flex-column" md={6}>
					<h2>Редактор Курсів</h2>
					<Button
						variant={"outline-dark"}
						className="mt-2 p-2"
						onClick={() => setCourseVisable(true)}
					>
						Додати курс
					</Button>
					<Button
						variant={"outline-dark"}
						className="mt-2 p-2"
						onClick={() => setParagraphVisable(true)}
					>
						Додати параграф
					</Button>
					<Button
						variant={"outline-dark"}
						className="mt-2 p-2"
						onClick={() => setThemVisable(true)}
					>
						Додати тему
					</Button>
					<Button
						variant={"outline-dark"}
						className="mt-2 p-2"
						onClick={() => setTestVisable(true)}
					>
						Додати тест
					</Button>

					<CreateCourse
						show={courseVisable}
						onHide={() => setCourseVisable(false)}
					/>
					<CreateParagraph
						show={paragraphVisable}
						onHide={() => setParagraphVisable(false)}
					/>
					<CrateThem show={themVisable} onHide={() => setThemVisable(false)} />
					<CreateTest show={testVisable} onHide={() => setTestVisable(false)} />
				</Col>
				<Col className="mt-3 d-flex flex-column" md={6}>
					<h2>Робота з студентами</h2>
					<Button
						variant={"outline-dark"}
						className="mt-2 p-2"
						onClick={() => setSuccessRegistration(true)}
					>
						Запит на регестрацію
					</Button>
					<Button
						variant={"outline-dark"}
						className="mt-2 p-2"
						onClick={() => setAddCourseToStudentVisable(true)}
					>
						Додати студентів до курссів
					</Button>
					<AgreeRegistration
						show={successRegistration}
						onHide={() => setSuccessRegistration(false)}
					></AgreeRegistration>
					<AddCourseToStudent
						show={addCourseToStudentVisable}
						onHide={() => setAddCourseToStudentVisable(false)}
					/>
				</Col>
			</Row>
		</Container>
	);
};

export default Admin;
