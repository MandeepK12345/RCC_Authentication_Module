import React, { useEffect } from "react";
import InputComponent from "../Input/index";
import Images from "../../utils/images";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { jwtDecode } from "jwt-decode";
import { googleLogout } from "@react-oauth/google";
import InputGroup from "react-bootstrap/InputGroup";
import ButtonComponent from "../Button";
import { useNavigate } from "react-router-dom";
import { routesPath } from "../../Router/routes";
import GoogleCustomLogin from "../GoogleLogin";
import FacebookLogin from "../../Component/FacebookLogin";
import TextMsg from "../../utils/textMessages";
import "./index.css";
import LinkedInPage from "../LinkedIn";
import postApiCall from "../../api/methods";
import endPoint from "../../api/endPoint";


const emailPattren = new RegExp(
	"^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9]+.)+[a-zA-Z]{2,}$"
);

const passwordPattren = new RegExp(
	"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
);

const numRegex = new RegExp(/^\d{10}$/);

export default function Login() {
	const [showPassword, setShowPassword] = React.useState(false);
	const [dataLogin, setDataLogin] = React.useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = React.useState({});
	const [rememberChecked, setRememberChecked] = React.useState(false);
	const [disableSubmitButton, setDisableSubmitButton] = React.useState(false);
	const [googleLoginData, setGoogleLoginData] = React.useState({});
	const [showLoginButton, setShowLoginButton] = React.useState(true);
	const [showLogoutButton, setShowLogoutButton] = React.useState(false);
	const [phonePrefix, setPhonePrefix] = React.useState(false);
	const [showPhoneField, setShowPhoneField] = React.useState(false);
	const [phoneDropDown, setPhoneDropDown] = React.useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (dataLogin?.email?.match(numRegex)) {
			setPhonePrefix(true);
		} else {
			setPhonePrefix(false);
		}
	}, [dataLogin.email]);

	const handleInputChange = (e) => {
		const { value, name } = e?.target;
		setDataLogin({ ...dataLogin, [name]: value });
		setErrors({});
	};

	const submitHandler = (event) => {
		event.preventDefault();
		const phonePattren = new RegExp("^[0-9]+$");
		const errors = {};
		if (phonePrefix) {
			if (!dataLogin.email.match(phonePattren)) {
				errors.phone = TextMsg.Login.validMobile;
			}
		} else {
			if (!dataLogin?.email) {
				errors.email = "Email / Phone is required";
			} else if (!dataLogin?.email?.match(emailPattren)) {
				errors.email = "Please enter a valid email address";
			}
		}
		if (!dataLogin.password) {
			errors.password = "Password is not defined";
		} else if (!dataLogin.password.match(passwordPattren)) {
			errors.password = "Please enter a valid password";
		}
		setErrors({ ...errors });
		if (!Object.keys(errors).length) {
			navigate(routesPath.HOMESCREEN);
		}
		if (rememberChecked && dataLogin.email && dataLogin.password) {
			localStorage.setItem("phoneNo", dataLogin.email);
			localStorage.setItem("password", dataLogin.password);
		}
		const { email, password } = dataLogin;
		const payload ={
			email,
			password
		}

		// if(!phonePrefix){
		postApiCall(
			endPoint.userLogin,
			payload, // Phone and password API call
			(s)=>{
				console.log("success", s);
			},
			(e) => {
				if (errors.email || errors.phone || errors.password) {
					console.log(errors, 'error')
				} else {
				  console.log(null, 'error')
				}
			  }
		);
		// }

	};
	const handleRememberCheck = () => {
		setRememberChecked(!rememberChecked);
	};
	useEffect(() => {
		if (!Object.keys(errors).length) {
			setDisableSubmitButton(true);
		}
	}, [errors]);

	const GoogleLogout = () => {
		googleLogout();
		setShowLoginButton(true);
		setShowLogoutButton(false);
		sessionStorage.removeItem("Given_name");
		sessionStorage.removeItem("email");
		setGoogleLoginData({});
	};

	const googleLoginSuccessHandler = (credentialResponse) => {
		const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
		setGoogleLoginData(credentialResponseDecoded); // Access token is available in googleLoginData
		setShowLoginButton(false);
		setShowLogoutButton(true);
		sessionStorage.setItem("Given_name", credentialResponseDecoded.given_name);
		sessionStorage.setItem("email", credentialResponseDecoded.email);
	};

	const showPhoneFieldHandler = () => {
		setShowPhoneField(true);
		setPhoneDropDown(dataLogin.email);
	};

	const fbLoginSuccessHandler = (resp) => {
		console.info("fbLoginSuccessHandler", resp.data.name);
		alert(resp.data.name + " logged in using facebook");
	};

	const fbLoginErrorHandler = (err) => {
		console.info("fbLoginErrorHandler", err);
	};

	const inbuiltPhoneHandler = (event) => {
		console.info("event", event);
	};
	return (
		<Container className="login-wrapper mt-4">
			<Form>
				<Row className="login-wrapper__label mb-4">Login Form</Row>
				<Row>
					{showPhoneField ? (
						<PhoneInput
							className="phoneInput"
							country="in"
							enableSearch={true}
							value={phoneDropDown}
							onChange={inbuiltPhoneHandler}
						/>
					) : (
						<>
							{phonePrefix ? (
								<InputGroup className="mb-3">
									<InputGroup.Text
										id="basic-addon1"
										onClick={showPhoneFieldHandler}
									>
										+91
									</InputGroup.Text>
									<Form.Control
										type="text"
										label="Email/Phone no."
										placeholder="Enter your Email or Phone No."
										name="email"
										onChange={handleInputChange}
										value={dataLogin.email}
										error={errors.email}
									/>
								</InputGroup>
							) : (
								<InputComponent
									type="text"
									label="Email/Phone no."
									placeholder="Enter your Email or Phone No."
									name="email"
									onChange={handleInputChange}
									value={dataLogin.email}
									error={errors.email}
								/>
							)}
						</>
					)}
				</Row>

				<Row className="mb-3 login-wrapper__passwordField">
					<InputComponent
						type={showPassword ? "text" : "password"}
						label="Password"
						name="password"
						placeholder="Enter your Password"
						onChange={handleInputChange}
						value={dataLogin.password}
						error={errors.password}
					/>
					<img
						src={Images.VisibilityIcon}
						className="login-wrapper__eyeImage"
						onClick={() => setShowPassword(!showPassword)}
					/>
				</Row>

				<Row className="mt-2">
					<Form.Group className="mb-3">
						<Form.Check
							type="checkbox"
							label="Keep me logged in"
							onChange={handleRememberCheck}
						/>
						<a
							onClick={() => {
								navigate(routesPath.FORGOTPASSWORD);
							}}
							href="javascript:void(0)"
							class="link-primary"
						>
							Forgot Password
						</a>
					</Form.Group>
				</Row>

				<ButtonComponent
					label="Submit"
					btnHandler={submitHandler}
					disable={disableSubmitButton}
				/>

				<Row className="mt-2">
					<div>
						<span>Don't have account yet ?</span>
						<a
							onClick={() => navigate(routesPath.SIGNUP)}
							href="javascript:void(0)"
							class="link-primary"
						>
							Signup
						</a>
					</div>
				</Row>
			</Form>

			<FacebookLogin
				fbLoginSuccessHandler={fbLoginSuccessHandler}
				fbLoginErrorHandler={fbLoginErrorHandler}
			/>

			<GoogleCustomLogin
				showLoginButton={showLoginButton}
				showLogoutButton={showLogoutButton}
				googleLoginSuccessHandler={googleLoginSuccessHandler}
				googleLoginData={googleLoginData}
				Google
				Logout={GoogleLogout}
			/>
			<LinkedInPage />
		</Container>
	);
}
