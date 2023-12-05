import React, { useEffect } from "react";
import InputComponent from "../Input/index";
import Images from "../../utils/images";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import ButtonComponent from "../Button";
import "./index.css";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../helper/constants";
import { jwtDecode } from "jwt-decode";
import { googleLogout } from "@react-oauth/google";
import GoogleCustomLogin from "../GoogleLogin";
import InputGroup from "react-bootstrap/InputGroup";
import FacebookLogin from '../../Component/FacebookLogin'

export default function Login() {
	const navigate = useNavigate();
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
	const [phone, setPhone] = React.useState("");

	useEffect(() => {
		const numRegex = new RegExp(/^\d{10}$/); // to consider as phoneNo
		if (dataLogin?.email?.match(numRegex)) {
			console.log("data email", dataLogin.email);
			setPhonePrefix(true);
		} else {
			setPhonePrefix(false);
		}
	}, [dataLogin.email]);

	console.log("phoneprefix is", phonePrefix);
	const handleInputChange = (e) => {
		const { value, name } = e?.target;
		setDataLogin({ ...dataLogin, [name]: value });
		setErrors({});
	};

	const submitHandler = (event) => {
		event.preventDefault();
		const emailPattren = new RegExp(
			"^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9]+.)+[a-zA-Z]{2,}$"
		);
		const passwordPattren = new RegExp(
			"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
		);
		const phonePattren = new RegExp("^[0-9]+$");
		const errors = {};
		if (phonePrefix) {
			if (!dataLogin.email.match(phonePattren)) {
				errors.phone = "Please enter a valid mobile number";
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
			navigate(ROUTES.HOMESCREEN);
		}
		if (rememberChecked && dataLogin.email && dataLogin.password) {
			localStorage.setItem("phoneNo", dataLogin.email);
			localStorage.setItem("password", dataLogin.password);
		}
	};
	const handleRememberCheck = () => {
		setRememberChecked(!rememberChecked);
	};
	useEffect(() => {
		if (!Object.keys(errors).length) {
			setDisableSubmitButton(true);
		}
	}, [errors]);

	console.log("Google login data is", googleLoginData);
	console.log(
		"name and email are",
		googleLoginData.given_name,
		googleLoginData.email
	);
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
		setGoogleLoginData(credentialResponseDecoded);
		setShowLoginButton(false);
		setShowLogoutButton(true);
		sessionStorage.setItem("Given_name", credentialResponseDecoded.given_name);
		sessionStorage.setItem("email", credentialResponseDecoded.email);
	};

	const showPhoneFieldHandler = () => {
		setShowPhoneField(true);
	};

	return (
		<Container className="login-wrapper mt-4">
			<Form>
				<Row className="login-wrapper__label mb-4">Login Form</Row>
				<Row>
					{showPhoneField ? (
						<PhoneInput
							className="phoneInput"
							country={"in"}
							enableSearch={true}
							value={"+91" + dataLogin.email}
							onChange={(phone) => setPhone(phone)}
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
										onChange={handleInputChange}
										label="Email/Phone no."
										placeholder="Enter your Email or Phone No."
										name="email"
										value={dataLogin.email}
										error={errors.email}
									/>
								</InputGroup>
							) : (
								<InputComponent
									type="text"
									onChange={handleInputChange}
									label="Email/Phone no."
									placeholder="Enter your Email or Phone No."
									name="email"
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
						onChange={handleInputChange}
						label="Password"
						name="password"
						placeholder="Enter your Password"
						value={dataLogin.password}
						error={errors.password}
					/>
					<img
						src={Images.VisibilityIcon}
						onClick={() => setShowPassword(!showPassword)}
						className="login-wrapper__eyeImage"
					/>
				</Row>
				<Row>
					<Form.Group className="mb-3">
						<Form.Check
							type="checkbox"
							label="Keep me logged in"
							onChange={handleRememberCheck}
						/>
						<a
							onClick={() => {
								navigate(ROUTES.FORGOTPASSWORD);
							}}
							href="#"
							class="link-primary"
						>
							Forgot Password
						</a>
					</Form.Group>
				</Row>
				{disableSubmitButton ? (
					<ButtonComponent label="Submit" btnHandler={submitHandler} disable />
				) : (
					<ButtonComponent label="Submit" btnHandler={submitHandler} />
				)}
				<Row>
					<p>
						Don't have account yet ? <span></span>
						<a
							onClick={() => {
								navigate(ROUTES.SIGNUP);
							}}
							href="#"
							class="link-primary"
						>
							Signup
						</a>
					</p>
				</Row>
			</Form>
			<FacebookLogin/>
			<GoogleCustomLogin
				showLoginButton={showLoginButton}
				showLogoutButton={showLogoutButton}
				googleLoginSuccessHandler={googleLoginSuccessHandler}
				googleLoginData={googleLoginData}
				GoogleLogout={GoogleLogout}
			/>
		</Container>
	);
}
