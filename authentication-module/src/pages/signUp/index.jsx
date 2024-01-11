import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { useDispatch } from "react-redux";
import "react-phone-input-2/lib/bootstrap.css";
import { Form, Row, Container} from "react-bootstrap";
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
import SocialIcons from "../../components/socialIcons";
import "./index.css";

//handled email and Phone number tab
const signUpToggle = [
	{ name: TextMsg.SignUp.signUpToggleEmail, value: "1" },
	{ name: TextMsg.SignUp.signUpTogglePhone, value: "2" },
];

//signup component
export default function Signup() {
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [dataLogin, setDataLogin] = useState({
		email: "",
		password: "",
		confirmPassword: ""
	});
	const [radioValue, setRadioValue] = useState("1");
	const [errors, setErrors] = useState({});
	const [disableSubmitButton, setDisableSubmitButton] = useState(true);
	const [countryCode, setCountryCode] = useState("+91");
	const [agreeTerms, setAgreeTerms] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleInputChange = (e) => {
		const { value, name } = e?.target;
		if (name === "email") {
			setDataLogin({ ...dataLogin, [name]: value?.replace(/ /g, "") });
		} else if (name === "password" || name === "confirmPassword") {
			setDataLogin({ ...dataLogin, [name]: value });
		}
		setErrors({});
	};

	useEffect(() => {
		if (radioValue === "1") {
			setDisableSubmitButton(
				dataLogin?.email?.length &&
					dataLogin?.password?.length &&
					dataLogin?.confirmPassword?.length &&
					agreeTerms
					? false
					: true
			);
		} else if (radioValue === "2") {
			setDisableSubmitButton(dataLogin?.email?.length && agreeTerms ? false : true);
		}
	}, [dataLogin.email, dataLogin.password, dataLogin.confirmPassword, agreeTerms]);

	//SignUp handler
	const submitHandler = (event) => {
		event.preventDefault();
		if (agreeTerms) {
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
						countryCode,
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
								data: { email, countryCode }
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
										navigate(routesPath.VERIFY, {
											state: {
												from: "signup",
												isEmail: radioValue === "1" ? true : false,
											},
										});
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
		} else {
			alert("Please agree to the terms and conditions");
		}
	};
	// multiple country code dropDown Handler
	const inbuiltPhoneHandler = (_value, data) => {
		const result = _value.substring(data?.dialCode?.length);
		const errors = {};

		if (result.length < 7) {
			errors.email = TextMsg.Login.phoneNoMinimumLength;
		} else if (result.length > 15) {
			errors.email = TextMsg.Login.phoneNoMaximumLength;
		}
		setErrors({ ...errors });
		setDataLogin({ ...dataLogin, email: result });
		setCountryCode("+" + data?.dialCode);
	};

	//handled phone and email fields of tab
	const toggleHandler = (value) => {
		setErrors({});
		setDataLogin({ password: "", email: "" });
		setAgreeTerms(false)
		setRadioValue(value);
		setCountryCode("+91");
	};
	const handleCheckboxChange = () => {
		setAgreeTerms(!agreeTerms);
	};

	return (
		<Container className="authForm login-wrapper">
			<h1>{TextMsg.SignUp.heading}</h1>
			<p>{TextMsg.SignUp.subHeading}</p>
			<Form className="form">
				<Row>
					<ButtonGroup className="mb-2 toggleBtn">
						{signUpToggle.map((radio, idx) => (
							<ToggleButton
								key={idx}
								id={`radio-${idx}`}
								type={TextMsg.SignUp.radio}
								variant="secondary"
								name={TextMsg.SignUp.radio}
								value={radio.value}
								checked={radioValue === radio.value}
								onChange={(e) => toggleHandler(e.target.value)}
								className={radioValue === radio.value ? "toggle-active" : ""}
							>
								{radio.name}
							</ToggleButton>
						))}
					</ButtonGroup>
					{radioValue === "2" ? (
						<>
							<label>Phone Number</label>
							<PhoneInput
								// alwaysDefaultMask={false}
								className="phoneInput"
								country="in"
								enableSearch={true}
								onChange={inbuiltPhoneHandler}
								placeholder={TextMsg.Login.radioValuePhone}
								countryCodeEditable={false}
								onEnterKeyPress={submitHandler} // handled enter press from keyboard
							/>
							{errors.email && (
								<Form.Text className="input-wrapper__errMsg">
									{errors.email}
								</Form.Text>
							)}
						</>
					) : (
						
						<>
							<Form.Group className="mb-4 input-wrapper">
								<Form.Label className="d-flex">Email</Form.Label>
								<Form.Control
									type="text"
									placeholder={TextMsg.Login.radioValueEmail}
									name="email"
									onChange={handleInputChange}
									value={dataLogin.email}
								/>
							</Form.Group>
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
								type={
									showPassword
										? TextMsg.SignUp.radioValueText
										: TextMsg.SignUp.radioValuePassword
								}
								label={TextMsg.SignUp.createPassword}
								name={TextMsg.SignUp.password}
								placeholder={TextMsg.SignUp.newPassword}
								onChange={handleInputChange}
								value={dataLogin.password}
								error={errors.password}
							/>
							<img
								src={showPassword ? Images.showEye : Images.hideEye}
								className="login-wrapper__eyeImage"
								onClick={() => setShowPassword(!showPassword)}
								alt={TextMsg.SignUp.eyeImage}
							/>
						</Row>
						<Row className="login-wrapper__passwordField">
							<InputComponent
								type={
									showConfirmPassword
										? TextMsg.SignUp.radioValueText
										: TextMsg.SignUp.radioValuePassword
								}
								label={TextMsg.SignUp.labelConfirmPassword}
								name={TextMsg.SignUp.nameConfirmPassword}
								placeholder={TextMsg.SignUp.confirmPassword}
								onChange={handleInputChange}
								value={dataLogin.confirmPassword}
								error={errors.confirmPassword}
							/>
							<img
								src={showConfirmPassword ? Images.showEye : Images.hideEye}
								className="login-wrapper__eyeImage"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								alt={TextMsg.SignUp.eyeImage}
							/>
						</Row>
					</>
				)}
				<Row className="mt5">
						<Form.Check
						type="checkbox"
						label = {
							<>
							I agree to {''} <a href="https://surface.appinventive.com/site/terms-and-conditions" target="_blank">Terms and Conditions </a>
							and {''}<a href="https://appinventiv.com/privacy-policy/" target ="_blank">Privacy Policy</a>
							{' '}of application
							</>
						}
						onChange={handleCheckboxChange}
						checked={agreeTerms} />
				</Row>
				<Row className="mt5">
					<ButtonComponent
						label={
							radioValue === "1" ? TextMsg.SignUp.next : TextMsg.SignUp.sendOtp
						}
						btnHandler={submitHandler}
						disabled={disableSubmitButton}
					/>
				</Row>
				<Row className="mt-2">
					<span>{TextMsg.SignUp.alreadyHaveAccount} </span>
					<a
						onClick={() => navigate(routesPath.LOGIN)}
						href="javascript:void(0)"
						class="link-primary"
					>
						{TextMsg.Login.login}
					</a>
				</Row>
				<SocialIcons />
			</Form>
		</Container>
	);
}
