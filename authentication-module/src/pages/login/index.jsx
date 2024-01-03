import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { Form, Row, Container, InputGroup } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../state";
import ButtonComponent from "../../components/button";
import { routesPath } from "../../router/routes";
import TextMsg from "../../constants/textMessages";
import { postApiCall } from "../../api/methods";
import endPoint from "../../api/endPoint";
import InputComponent from "../../components/input";
import Images from "../../utils/images";
import {
	emailPattern,
	passwordPattern,
	phonePattern,
} from "../../utils/common";
import "./index.css";

const loginToggle = [
	{ name: TextMsg.Login.loginToggleEmail, value: "1" },
	{ name: TextMsg.Login.loginTogglePhone, value: "2" },
];

export default function Login() {
	const [showPassword, setShowPassword] = React.useState(false);
	const [dataLogin, setDataLogin] = React.useState({
		email: "",
		password: "",
	});
	const [radioValue, setRadioValue] = useState("1");
	const [errors, setErrors] = useState({});
	const [disableSubmitButton, setDisableSubmitButton] = useState(true);
	const [showPhoneField, setShowPhoneField] = useState(false);
	const [phoneDropDown, setPhoneDropDown] = useState("");
	const [countryCode, setCountryCode] = useState("+91");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	//Form input  handler to set state

	const handleInputChange = (e) => {
		const { value, name } = e?.target;
		const errors = {};
		if (name === "email" && radioValue === "2") {
			if (value.length < 7) {
				errors.email = "Phone number field should contain minimum 7 digits";
			} else if (value.length > 15) {
				errors.email = "Phone number field should contain maximum 15 digits";
			}
			setErrors({ ...errors });
		}

		setDataLogin(() => ({ ...dataLogin, [name]: value?.replace(/ /g, "") }));
	};

	useEffect(() => {
		if (radioValue === "1") {
			setDisableSubmitButton(
				dataLogin?.email?.length && dataLogin?.password?.length ? false : true
			);
		} else if (radioValue === "2") {
			setDisableSubmitButton(dataLogin?.email?.length ? false : true);
		}
	}, [dataLogin.email, dataLogin.password]);

	// Login handler
	const submitHandler = (event) => {
		event.preventDefault();
		const { email, password } = dataLogin;
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
		}
		setErrors({ ...errors });
		if (!Object.keys(errors).length) {
			setDisableSubmitButton(true);
			//login api call
			let payload = {
				email,
				password,
			};
			if (radioValue === "2") {
				payload = {
					countryCode: countryCode,
					phoneNo: email,
				};
			}

			postApiCall(
				radioValue === "2" ? endPoint.generateOTP : endPoint.userLogin,
				payload, // Phone and password API call
				(response) => {
					if (response.status === 200) {
						if (radioValue === "2") {
							toast.success(response.data.message, {
								toastId: "loginSuccess",
							});
							navigate(routesPath.VERIFY, {
								state: {
									from: "login",
									contextInfo: { mobile: email, countryCode: countryCode },
								},
							});
						} else {
							const { email } = response?.data.data;
							toast.success(`login successfully`, {
								toastId: "loginSuccess",
							});
							// dispatching an action to set userData in store
							dispatch(setUser({ ...response?.data?.data }));
							// on successful login navigting to dashboard
							navigate(routesPath.DASHBOARD);
						}
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
						toastId: "loginError",
					});
				}
			);
		}
	};

	const showPhoneFieldHandler = () => {
		setShowPhoneField(true);
		setPhoneDropDown(dataLogin.email);
	};
	// multiple country code dropDown Handler
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
		<Container className="login-wrapper mt-4">
			<Form>
				<Row className="login-wrapper__label mb-4">
					{TextMsg.Login.loginForm}
				</Row>
				<Row>
					<ButtonGroup className="mb-2 toggleBtn">
						{loginToggle.map((radio, idx) => (
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
							<InputGroup className="mb-2">
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
					<Row className="login-wrapper__passwordField">
						<InputComponent
							type={showPassword ? "text" : "password"}
							label="Password"
							name="password"
							placeholder={TextMsg.Login.loginPassword}
							onChange={handleInputChange}
							value={dataLogin.password}
							error={errors.password}
						/>
						<img
							src={showPassword ? Images.showEye : Images.hideEye}
							// className="login-wrapper__eyeImage"
							className="login-wrapper__eyeImage"
							onClick={() => setShowPassword(!showPassword)}
							alt="eyeImage"
						/>
					</Row>
				)}
				<Row className="mt5">
					<ButtonComponent
						label={radioValue === "1" ? "Login" : "Send OTP"}
						btnHandler={submitHandler}
						classname={disableSubmitButton ? "disableBtn" : ""}
					/>
				</Row>
				<Row className="mt-2">
					<span>{TextMsg.Login.dontHaveAccount}</span>
					<a
						onClick={() => navigate(routesPath.SIGNUP)}
						href="javascript:void(0)"
						class="link-primary"
					>
						{TextMsg.SignUp.signUp}
					</a>
				</Row>
				<Row className="mt-2">
					<span>{TextMsg.ForgotPassword.forgotYourPassword}</span>
					<a
						onClick={() => navigate(routesPath.FORGOTPASSWORD)}
						href="javascript:void(0)"
						class="link-primary"
					>
						{TextMsg.ForgotPassword.forgotPassword}
					</a>
				</Row>
			</Form>
		</Container>
	);
}
