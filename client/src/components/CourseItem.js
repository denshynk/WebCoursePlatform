import React from "react";
import { Card, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { COURSE_ROUTE } from "../utils/consts";

const CourseIten = ({ course }) => {
	const navigate = useNavigate();

	return (
		<Col
			md={3}
			className="mt-4 "
			onClick={() => navigate(COURSE_ROUTE + "/" + course.id)}
		>
			<Card
				className="p-2"
				style={{ backgroundColor: "black", cursor: "pointer" }}
				border="light"
			>
				<div className="text-black-100"></div>
				<div
					className="mt-2"
					style={{ color:'#fafafa' }}
				>
					{course.title}
				</div>
			</Card>
		</Col>
	);
};

export default CourseIten;
