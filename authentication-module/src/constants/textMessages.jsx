const TextMsg = {
	Login: {
		validMobile: "Please enter a valid mobile number",
		validEmail: "Please enter a valid email address",
		validPassword: "Password must be 8 characters long, an uppercase letter, a lowercase letter, a number, and a special character",
		passwordUndefined: "Password is not defined",
		emailRequired : "Email is required",
		phoneRequired : "Phone is required",
		loginToggleEmail : "Login with email",
		loginTogglePhone : "Login with phone",
		radioValueEmail : "Please Enter Your Email Address",
		radioValuePhone : "Please Enter Your Phone Number",
		loginPassword : "Please Enter Your Password",
		loginForm : "Login Page",
		dontHaveAccount : "Don't have account yet?    ",
	},
	ForgotPassword: {
		validEmail: "Please enter a valid email address",
		emailRequired : "Email is required",
		email : "Please Enter your Email Address",
		forgotYourPassword: "Forgot your password?    ",
		forgotPassword : " ForgotPassword"
	},
	SignUp :{
		signUpToggleEmail :"SignUp with email",
		signUpTogglePhone : "SignUp with phone",
		confirmPasswordField : "Password doesn't match with confirm password",
		newPassword : "Please Enter Your Password",
		confirmPassword : "Confirm Your Password",
		registerForm : "SignUp Page ",
		signUp : "   Signup"
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
