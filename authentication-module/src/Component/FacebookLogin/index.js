import { FacebookLoginButton } from "react-social-login-buttons";
import { LoginSocialFacebook } from "reactjs-social-login";
import LoginClientIds from '../../helper/loginclientIds';

export default function FacebookLogin(){
    return  <div>
    <LoginSocialFacebook
        appId={LoginClientIds.facebookAppId}
        onResolve={(response) => {
            console.log(response);
            alert("You are logged in using facebook");
        }}
        onReject={(error) => {
            console.log(error);
        }}
    >
        <FacebookLoginButton />
    </LoginSocialFacebook>
</div>
}