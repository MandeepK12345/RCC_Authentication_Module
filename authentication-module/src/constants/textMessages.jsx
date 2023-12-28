const TextMsg = {
	Login: {
		validMobile: "Please enter a valid mobile number",
		validEmail: "Please enter a valid email address",
		validPassword: "Please enter a valid password",
		passwordUndefined: "Password is not defined",
		emailRequired : "Email is required",
		phoneRequired : "Phone is required",
		loginToggleEmail : "Login with email",
		loginTogglePhone : "Login with phone",
		radioValueEmail : "Enter your Email",
		radioValuePhone : "Enter your Phone",
		loginPassword : "Enter your Password",
		loginForm : "Login Form",
		dontHaveAccount : "Don't have account yet ?",
	},
	ForgotPassword: {
		validEmail: "Please enter a valid email address",
		emailRequired : "Email is required",
		email : "Enter your Email",
		forgotYourPassword: "Forgot your password ?",
		forgotPassword : "ForgotPassword"
	},
	SignUp :{
		signUpToggleEmail :"SignUp with email",
		signUpTogglePhone : "SignUp with phone",
		confirmPasswordField : "confirm password should be same",
		newPassword : "Enter your new Password",
		confirmPassword : "Confirm your new Password",
		registerForm : "Register Form",
		signUp : "Signup"
	},
	VerifyAccount :{
		verifyAccount : "Verify your Account",
		sentOTP : "We have just sent an OTP to your registered",
		resendOTP : " Resend Otp"
	},
	ApiConfig : {
		deviceId : "abc@123",
		devicetype : 1,
		headerAuthorization : `Basic ${btoa("rcc:rcc@123")}`
	}
};

export default TextMsg;
