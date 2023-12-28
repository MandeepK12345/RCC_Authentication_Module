import Login from "../pages/login";
import Signup from "../pages/signUp";
import VerifyAccount from "../pages/verifyAccount";
import Dashboard from "../pages/dashboard";
import ForgotPassword from "../pages/forgotPassword";
import ResetPassword from "../pages/resetPassword";

const routesPath = {
	LOGIN: "/",
	DASHBOARD: "/dashboard",
	SIGNUP: "/signup",
	VERIFY: "/verify-account",
	FORGOTPASSWORD : "/forgot-password",
	RESETPASSWORD: "/reset-password"
};

const pageRoutes = [
	{
		name: "Login",
		path: routesPath.LOGIN,
		Component: Login,
	},
	{
		name: "Signup",
		path: routesPath.SIGNUP,
		Component: Signup,
	},
	{
		name: "verifyAccount",
		path: routesPath.VERIFY,
		Component: VerifyAccount,
	},
	{
		name: "Dashboard",
		path: routesPath.DASHBOARD,
		Component: Dashboard,
	},
	{
		name: "forgotPassword",
		path: routesPath.FORGOTPASSWORD,
		Component: ForgotPassword,
	},
	{
		name: "ResetPassword",
		path: routesPath.RESETPASSWORD,
		Component: ResetPassword,
	}
];

export { pageRoutes, routesPath };
