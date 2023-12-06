import HomeScreen from "../Component/Homescreen";
import Login from "../Component/Login";
import ForgotPassword from "../Component/ForgotPassword";
import Signup from "../Component/Signup";

const routesPath = {
	LOGIN: "/",
	FORGOTPASSWORD: "/forgot-password",
	HOMESCREEN: "/homescreen",
	SIGNUP: "/signup",
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
];

export { pageRoutes, routesPath };
