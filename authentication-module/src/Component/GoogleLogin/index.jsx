import { GoogleLogin } from "@react-oauth/google";
import ButtonComponent from "../Button";

export default function GoogleCustomLogin({
	showLoginButton,
	showLogoutButton,
	googleLoginData,
	googleLoginSuccessHandler,
	GoogleLogout,
}) {
	return (
		<div>
			{showLoginButton && (
				<GoogleLogin
					onSuccess={googleLoginSuccessHandler}
					onError={() => {
						console.log("Login Failed");
					}}
				/>
			)}
			<span>
				{googleLoginData.given_name} {googleLoginData.family_name}
			</span>
			{showLogoutButton && (
				<div className="googleLogoutBtn">
					<ButtonComponent
						btnHandler={GoogleLogout}
						label="Signout from gmail"
					/>
				</div>
			)}
		</div>
	);
}
