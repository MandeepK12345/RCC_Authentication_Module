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
		radioValueEmail : "Email",
		radioValuePhone : "Phone Number",
		loginPassword : "Password",
		loginForm : "Login Page",
		dontHaveAccount : "Don't have account yet?",
		login : "Login",
		heading : "Welcome",
		subHeading : "Please enter your details.",
		radioValueText : "text",
		radioValueNumber : "number",
		radioValuePassword : "password",
		sendOtp : "Send OTP",
		password : "Password",
		typeToggleButton : "radio",
		nameToggleButton : "radio",
		phoneNoMinimumLength : "Phone number field should contain minimum 7 digits",
		phoneNoMaximumLength : "Phone number field should contain maximum 15 digits",
		successToastId : "loginSuccess",
		errorToastId : "loginError"
	},
	ForgotPassword: {
		validEmail: "Please enter a valid email address",
		emailRequired : "Email is required",
		email : "Email Address",
		forgotYourPassword: "Forgot your password?",
		forgotPassword : " Forgot Password?"
	},
	SignUp :{
		signUpToggleEmail :"SignUp with email",
		signUpTogglePhone : "SignUp with phone",
		confirmPasswordField : "Password and confirm password does not match",
		newPassword : "New Password",
		confirmPassword : "Confirm New Password",
		registerForm : "SignUp Page ",
		signUp : "Signup",
		heading : "Create an Account",
		subHeading : "Get started by filling in your details below.",
		radio : "radio",
		radioValueText : "text",
		radioValueNumber : "number",
		radioValuePassword : "password",
		email : "email",
		createPassword : "Create Password",
		password : "password",
		labelConfirmPassword : "Confirm Password",
		nameConfirmPassword : "confirmPassword",
		eyeImage : "eyeImage",
		sendOtp : "Send OTP",
		next : "Next",
		alreadyHaveAccount : "Already have an account ?"
	},
	VerifyAccount :{
		verifyAccount : "Verify your Account",
		sentOTP : "We have just sent an OTP to",
		resendOTP : "Resend"
	},
	ApiConfig : {
		deviceId : "abc@123",
		devicetype : 1,
		headerAuthorization : `Basic ${btoa("rcc:rcc@123")}`
	}
};

export default TextMsg;
