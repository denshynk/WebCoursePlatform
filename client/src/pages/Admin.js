import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
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
		<Container className="mt-3 d-flex flex-column">
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
			<Button
				variant={"outline-dark"}
				className="mt-2 p-2"
				onClick={() => setAddCourseToStudentVisable(true)}
			>
				Додати групу студентів до курсу
			</Button>
			<Button
				variant={"outline-dark"}
				className="mt-2 p-2"
				onClick={() => setSuccessRegistration(true)}
			>
				Запит на регестрацію
			</Button>
			<AddCourseToStudent
				show={addCourseToStudentVisable}
				onHide={() => setAddCourseToStudentVisable(false)}
			/>
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
			<AgreeRegistration
				show={successRegistration}
				onHide={() => setSuccessRegistration(false)}
			></AgreeRegistration>
		</Container>
	);
};

export default Admin;
