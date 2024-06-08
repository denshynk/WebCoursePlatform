import React, { useContext, useEffect, useState } from "react";
import {
	Col,
	Container,
	Row,
	Card,
	ProgressBar,
	Button,
} from "react-bootstrap";
import { Context } from "../index";
import { fetchMyCourse } from "../http/courseApi";
import { useNavigate } from "react-router-dom";
import { COURSE_ROUTE } from "../utils/consts";
import StudentCourseInfo from "../components/modals/StudentCourseInfo";

const Account = () => {
	const { user } = useContext(Context);
	const [myCourses, setMyCourses] = useState([]);
	const [infoVisible, setInfoVisible] = useState(false);
	const [courseId, setCourseId] = useState();
	const [courseTitle, setCourseTitle] = useState();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchMyCourses = async () => {
			try {
				const data = await fetchMyCourse();
				setMyCourses(data);
			} catch (error) {
				console.error("Error fetching courses:", error);
			}
		};

		fetchMyCourses();
	}, []);

	const getColor = (percentage) => {
		if (percentage < 30) return "danger";
		else if (percentage < 60) return "warning";
		else if (percentage < 90) return "success";
	};

	const renderProgressBar = (result) => {
		const percentage = parseFloat(result);
		const color = getColor(percentage);
		return <ProgressBar now={percentage} variant={color} />;
	};

	return (
		<Container className="mt-5">
			<Row>
				<Col md={4}>
					<Card>
						<Card.Body>
							<Card.Title>Профиль пользователя</Card.Title>
							<Card.Text>
								<strong>Группа:</strong> {user.user.group} <br />
								<strong>Имя:</strong> {user.user.name} <br />
								<strong>Фамилия:</strong> {user.user.surname}
								<br />
								<strong>Email:</strong> {user.user.email}
								<br />
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>
				<Col md={8}>
					{myCourses.map((course, index) => (
						<Card
							key={course.id}
							style={{ height: "150px", borderRadius: "20px" }}
							className="m-3 d-flex flex-column cursor-pointer"
							text="black"
						>
							<Card.Body
								onClick={() => navigate(COURSE_ROUTE + "/" + course.id)}
							>
								<Card.Title>{course.title}</Card.Title>
								<div className="mt-auto">
									<h1 className="m-0 d-flex justify-content-end">
										{course.result ?? 0}
									</h1>
									{renderProgressBar(course.result ?? 0)}
								</div>
							</Card.Body>
							<Button className='p-0'
								variant="link"
								onClick={() => {
									setInfoVisible(true);
									setCourseId(course.id);
									setCourseTitle(course.title)
								}}
							>
								Детальніше
							</Button>
						</Card>
					))}
				</Col>
			</Row>
			<StudentCourseInfo
					show={infoVisible}
					onHide={() => setInfoVisible(false)}
					prevcourseId={courseId}
					prevcourseTitle={courseTitle}
				/>
		</Container>
	);
};

export default Account;
