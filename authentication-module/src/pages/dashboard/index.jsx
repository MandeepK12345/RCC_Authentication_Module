import { Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./index.css";

export default function Dashboard() {
	const userInfo = useSelector((state) => state?.user);
	const { email, mobileNo } = userInfo || {};

	return (
		<Container fluid className="alignCentre p-0">
			<Row className="user-dashboard">User Dashboard</Row>
			<Row className="user-dashboard m-0">
				Welcome : 
				{" "}<span>
					{mobileNo}
					{email}
				</span>
			</Row>
		</Container>
	);
}
