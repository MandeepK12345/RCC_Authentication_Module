import Images from "../utils/images";
import Login from "../pages/login";
import Register from "../pages/signUp";
import ResetPassword from "../pages/resetPassword";
import VerifyAccount from "../pages/verifyAccount";
import ForgotPassword from "../pages/forgotPassword";
import '../styles/authLayout.css'
// import Footer from './Footer'

export default function AuthLayout({ page }) {

  const getComponentToShow = () => {
		switch (page) {
			case "login":
				return <Login />;
			case "resetPassword":
				return <ResetPassword />;
			case "signUp":
				return <Register />;
			case "verifyAccount":
				return <VerifyAccount />;
			case "forgotPassword":
				return <ForgotPassword />;
			default:
				return null;
		}
	};
	return (
		<div className="rccAuthContainer">
			<div className="rccAuthHeader">
				<div className="rccAuthHeaderInner">
					<div className="logo">
						<img src={Images.logo} alt="Logo" />
					</div>
				</div>
			</div>
			<div className="rccAuthBody">
				<div className="slider"><img class="onboardingImg" src={Images.slider} alt="backgroundImage" role="presentation"/></div>
				<div className="componentContainer">{getComponentToShow(page)}</div>
			</div>
			{/* <Footer /> */}
		</div>
	);
}
