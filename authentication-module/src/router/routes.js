import Dashboard from "../pages/dashboard";
import AuthLayout  from "../containers/authLayout";

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
		Component: AuthLayout,
		pageProp: { page: 'login' },
	},
	{
		name: "Signup",
		path: routesPath.SIGNUP,
		Component: AuthLayout,
		pageProp: { page: 'signUp' },
	},
	{
		name: "verifyAccount",
		path: routesPath.VERIFY,
		Component: AuthLayout,
		pageProp: { page: 'verifyAccount' },
	},
	{
		name: "Dashboard",
		path: routesPath.DASHBOARD,
		Component: Dashboard,
	},
	{
		name: "forgotPassword",
		path: routesPath.FORGOTPASSWORD,
		Component: AuthLayout,
		pageProp: { page: 'forgotPassword' },
	},
	{
		name: "ResetPassword",
		path: routesPath.RESETPASSWORD,
		Component: AuthLayout,
		pageProp: { page: 'resetPassword' },
	}
];

export { pageRoutes, routesPath };
