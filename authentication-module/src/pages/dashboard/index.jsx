import { Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../components/button";
import { setUser } from "../../state";
import { useNavigate } from "react-router-dom";
import { routesPath } from "../../router/routes";
import { toast } from "react-toastify";
import "./index.css";

export default function Dashboard() {
	const userInfo = useSelector((state) => state?.user);
	const { email, mobileNo } = userInfo || {};
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const logoutHandler = () => {
		dispatch(setUser(null));
		toast.success("Logout successfully");
		navigate(routesPath.LOGIN);
	};

	return (
		<Container fluid className="alignCentre p-0">
			<Row className="user-dashboard">User Dashboard</Row>
			<Row className="user-dashboard m-0">
				Welcome :{" "}
				<span>
					{mobileNo}
					{email}
				</span>
			</Row>
			<Row className="user-dashboard m-0">
				<ButtonComponent label="Logout" btnHandler={logoutHandler} />
			</Row>
		</Container>
	);
}
