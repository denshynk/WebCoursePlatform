import React, { useContext, useEffect } from "react";
import { Context } from "../index.js";
import { Container, Row } from "react-bootstrap";
import CourseItem from "../components/CourseItem.js";
import { observer } from "mobx-react-lite";
import { fetchCourse } from "../http/courseApi.js";

const AllCourse = observer(() => {
	const { course } = useContext(Context);

	useEffect(() => {
		fetchCourse().then((data) => course.setCourses(data));
	},[])
  
	return (
		<Container>
			<Row className="d-flex mt-2">
				{course._courses.map((course) => (
					<CourseItem key={course.id} course={course} />
				))}
			</Row>
		</Container>
	);
});

export default AllCourse;
