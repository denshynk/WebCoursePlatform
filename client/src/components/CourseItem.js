import React from "react";
import { Card, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { COURSE_ROUTE } from "../utils/consts";

const CourseIten = ({ course }) => {
	const navigate = useNavigate();

	return (
		<Col md={3} className="mt-4" onClick={() => navigate(COURSE_ROUTE + '/' + course.id)}> 
			<Card style={{ width: 150, cursor: "pointer" }} border="light">
        <Image width={150} height={150} src={course.img} />
        <div className="text-black-50">
          <div >Веб Програмування</div>
        </div>
        <div>{course.title}</div>
			</Card>
		</Col>
	);
};

export default CourseIten;
