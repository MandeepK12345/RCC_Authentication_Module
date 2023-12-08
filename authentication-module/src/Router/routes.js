import HomeScreen from "../Component/Homescreen";
import Login from "../Component/Login";
import ForgotPassword from "../Component/ForgotPassword";
import Signup from "../Component/Signup";
import { LinkedInCallback } from 'react-linkedin-login-oauth2';


const routesPath = {
	LOGIN: "/",
	FORGOTPASSWORD: "/forgot-password",
	HOMESCREEN: "/homescreen",
	SIGNUP: "/signup",
	LINKEDIN: "/linkedin"
};

const pageRoutes = [
	{
		name: "Login",
		path: routesPath.LOGIN,
		Component: Login,
	},
	{
		name: "Homescreen",
		path: routesPath.HOMESCREEN,
		Component: HomeScreen,
	},
	{
		name: "ForgotPassword",
		path: routesPath.FORGOTPASSWORD,
		Component: ForgotPassword,
	},
	{
		name: "Signup",
		path: routesPath.SIGNUP,
		Component: Signup,
	},
	{
		name : "LinkedIn",
		path : routesPath.LINKEDIN,
		Component : LinkedInCallback,
	}
];

export { pageRoutes, routesPath };
