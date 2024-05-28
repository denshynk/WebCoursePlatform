import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap';

const AddCourseToStudent = ({show, onHide}) => {
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
					Створити Курс
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Control placeholder={"Назва курсу"} />
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="outline-danger" onClick={onHide}>
					Закрити
				</Button>
				<Button variant="outline-success" onClick={onHide}>
					Додати
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default AddCourseToStudent