import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { useDispatch } from "react-redux";
import "react-phone-input-2/lib/bootstrap.css";
import { Form, Row, Container, InputGroup } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { setUser } from "../../state";
import InputComponent from "../../components/input";
import Images from "../../utils/images";
import ButtonComponent from "../../components/button";
import TextMsg from "../../constants/textMessages";
import { postApiCall } from "../../api/methods";
import endPoint from "../../api/endPoint";
import { routesPath } from "../../router/routes";
import {
	emailPattern,
	passwordPattern,
	phonePattern,
} from "../../utils/common";
import "./index.css";

const signUpToggle = [
	{ name: TextMsg.SignUp.signUpToggleEmail, value: "1" },
	{ name: TextMsg.SignUp.signUpTogglePhone, value: "2" },
];

export default function Signup() {
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [dataLogin, setDataLogin] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [radioValue, setRadioValue] = useState("1");
	const [errors, setErrors] = useState({});
	const [disableSubmitButton, setDisableSubmitButton] = useState(true);
	const [showPhoneField, setShowPhoneField] = useState(false);
	const [phoneDropDown, setPhoneDropDown] = useState("");
	const [countryCode, setCountryCode] = useState("+91");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleInputChange = (e) => {
		const { value, name } = e?.target;
		setDataLogin(() => ({ ...dataLogin, [name]: value?.replace(/ /g, "") }));
		setErrors({});
	};

	useEffect(() => {
		if (radioValue === "1") {
			setDisableSubmitButton(
				dataLogin?.email?.length &&
					dataLogin?.password?.length &&
					dataLogin?.confirmPassword?.length
					? false
					: true
			);
		} else if (radioValue === "2") {
			setDisableSubmitButton(dataLogin?.email?.length ? false : true);
		}
	}, [dataLogin.email, dataLogin.password, dataLogin.confirmPassword]);

	const submitHandler = (event) => {
		event.preventDefault();
		const { email, password, confirmPassword } = dataLogin;
		const errors = {};
		if (!email) {
			errors.email =
				radioValue === "1"
					? TextMsg.Login.emailRequired
					: TextMsg.Login.phoneRequired;
		} else if (radioValue === "2" && email && !email.match(phonePattern)) {
			errors.email = TextMsg.Login.validMobile;
		} else if (radioValue === "1" && email && !email.match(emailPattern)) {
			errors.email = TextMsg.Login.validEmail;
		}
		if (radioValue === "1") {
			if (!password) {
				errors.password = TextMsg.Login.passwordUndefined;
			} else if (!password.match(passwordPattern)) {
				errors.password = TextMsg.Login.validPassword;
			}

			if (!confirmPassword) {
				errors.confirmPassword = TextMsg.Login.passwordUndefined;
			} else if (!confirmPassword.match(passwordPattern)) {
				errors.confirmPassword = TextMsg.Login.validPassword;
			}

			if (password !== confirmPassword) {
				errors.confirmPassword = TextMsg.SignUp.confirmPasswordField;
			}
		}
		setErrors({ ...errors });
		if (!Object.keys(errors).length) {
			setDisableSubmitButton(true);
			//login api call
			let payload = {
				email,
				password,
				confirmPassword,
			};

			if (radioValue === "2") {
				payload = {
					countryCode: countryCode,
					phoneNo: email,
				};
			}

			// Sign Up API call
			postApiCall(
				endPoint.userSignup,
				payload,
				(response) => {
					if (response.data.httpCode === 200) {
						const {
							data: { email, countryCode },
							message,
						} = response?.data;

						let payloadGenerateOtp = { email };
						dispatch(setUser({ ...response?.data?.data }));

						if (radioValue === "2") {
							payloadGenerateOtp = {
								countryCode,
								phoneNo: dataLogin?.email,
							};
						}

						// generate OTP api after successful signup

						postApiCall(
							endPoint.generateOTP,
							payloadGenerateOtp,
							(response) => {
								if (response?.data.httpCode === 200) {
									toast.success(response.data.message, {
										toastId: "signupSuccess",
									});
									navigate(routesPath.VERIFY, { state: { from: "signup" } });
								}
							},
							(error) => {
								const {
									response: {
										data: { message },
									},
								} = error;
								toast.error(message, {
									toastId: "signupError",
								});
							}
						);
					}
					setDisableSubmitButton(false);
				},
				(error) => {
					const {
						response: {
							data: { message },
						},
					} = error;
					setDisableSubmitButton(false);
					toast.error(message, {
						toastId: "signupError",
					});
				}
			);
		}
	};

	const loginButtonHandler = () => {
		navigate(routesPath.LOGIN);
	};

	const showPhoneFieldHandler = () => {
		setShowPhoneField(true);
		setPhoneDropDown(dataLogin.email);
	};

	const inbuiltPhoneHandler = (_value, data) => {
		setDataLogin({ ...dataLogin, email: _value });
		setCountryCode("+" + data.dialCode);
	};

	const toggleHandler = (value) => {
		setShowPhoneField(false);
		setErrors({});
		setDataLogin({ ...dataLogin, email: "" });
		setRadioValue(value);
		setCountryCode("+91");
	};

	return (
		<Container className="authForm login-wrapper">
			<Form className="form">
				{/* <Row className="login-wrapper__label mb-4">{TextMsg.SignUp.registerForm}</Row> */}
				<h1>Create an Account</h1>
				<p>Get started by filling in your details below.</p>
				<Row>
					<ButtonGroup className="mb-2 toggleBtn">
						{signUpToggle.map((radio, idx) => (
							<ToggleButton
								key={idx}
								id={`radio-${idx}`}
								type="radio"
								variant="secondary"
								name="radio"
								value={radio.value}
								checked={radioValue === radio.value}
								onChange={(e) => toggleHandler(e.target.value)}
								className={radioValue === radio.value ? "toggle-active" : ""}
							>
								{radio.name}
							</ToggleButton>
						))}
					</ButtonGroup>
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
							<InputGroup className="mb-3">
								{radioValue === "2" && (
									<InputGroup.Text
										id="basic-addon1"
										onClick={showPhoneFieldHandler}
									>
										+91
									</InputGroup.Text>
								)}
								<Form.Control
									type={radioValue === "1" ? "text" : "number"}
									placeholder={
										radioValue === "1"
											? TextMsg.Login.radioValueEmail
											: TextMsg.Login.radioValuePhone
									}
									name="email"
									onChange={handleInputChange}
									value={dataLogin.email}
								/>
							</InputGroup>
							{errors.email && (
								<Form.Text className="input-wrapper__errMsg">
									{errors.email}
								</Form.Text>
							)}
						</>
					)}
				</Row>
				{radioValue === "1" && (
					<>
						<Row className="login-wrapper__passwordField">
							<InputComponent
								type="password"
								label="Create Password"
								name="password"
								placeholder={TextMsg.SignUp.newPassword}
								onChange={handleInputChange}
								value={dataLogin.password}
								error={errors.password}
							/>
						</Row>
						<Row className="login-wrapper__passwordField">
							<InputComponent
								type={showConfirmPassword ? "text" : "password"}
								label="Confirm Password"
								name="confirmPassword"
								placeholder={TextMsg.SignUp.confirmPassword}
								onChange={handleInputChange}
								value={dataLogin.confirmPassword}
								error={errors.confirmPassword}
							/>
							<img
								src={showConfirmPassword ? Images.showEye : Images.hideEye}
								className="login-wrapper__eyeImage"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								alt="eyeImage"
							/>
						</Row>
					</>
				)}

				<Row className="mt5">
					<ButtonComponent
						label={radioValue === "1" ? "Next" : "Send OTP"}
						btnHandler={submitHandler}
						classname={disableSubmitButton ? "disableBtn" : ""}
					/>
				</Row>

				<Row className="signupLink">
					<p>
						Already have an account yet?{" "}
						<ButtonComponent
							label="Login Now"
							btnHandler={loginButtonHandler}
						/>
					</p>
				</Row>
			</Form>
		</Container>
	);
}
