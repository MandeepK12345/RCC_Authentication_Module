import { FacebookLoginButton } from "react-social-login-buttons";
import { LoginSocialFacebook } from "reactjs-social-login";
import LoginClientIds from "../../helper/loginclientIds";

export default function FacebookLogin({
	fbLoginSuccessHandler,
	fbLoginErrorHandler,
}) {
	return (
		<LoginSocialFacebook
			appId={LoginClientIds.facebookAppId}
			onResolve={fbLoginSuccessHandler}
			onReject={fbLoginErrorHandler}
		>
			<FacebookLoginButton />
		</LoginSocialFacebook>
	);
}
