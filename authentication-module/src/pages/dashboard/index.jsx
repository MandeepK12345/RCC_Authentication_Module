import { Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Images from "../../utils/images";
import { setUser } from "../../state";
import { useNavigate } from "react-router-dom";
import { routesPath } from "../../router/routes";
import { toast } from "react-toastify";
import Avatar from "../../components/avatar";
import Footer from "../../components/footer";
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
		<div className="rccAuthContainer">
			<div className="rccAuthHeader">
				<div className="rccAuthHeaderInner">
					<div
						className="logo pointer-cursor"
						onClick={() => navigate(routesPath.LOGIN)}
					>
						<img src={Images.logo} alt="Logo" />
					</div>
				</div>
				<Avatar onClick={logoutHandler} label={mobileNo || email} />
			</div>
			<div className="rccAuthBody">
				<Row className="user-dashboard">
					Welcome &nbsp;
					<span>
						{mobileNo}
						{email}
					</span>
					<span>&nbsp;to the RCC Dashboard</span>
				</Row>
			</div>
			<Footer />
		</div>
	);
}
