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
import SocialIcons from "../../components/socialIcons";
import {
	emailPattern,
	passwordPattern,
	phonePattern,
} from "../../utils/common";
import "./index.css";

//handled email and Phone number tab
const loginToggle = [
	{ name: TextMsg.Login.loginToggleEmail, value: "1" },
	{ name: TextMsg.Login.loginTogglePhone, value: "2" },
];

//login component
export default function Login() {
	const [showPassword, setShowPassword] = React.useState(false);
	const [dataLogin, setDataLogin] = React.useState({
		email: "",
		password: "",
	});
	const [radioValue, setRadioValue] = useState("1");
	const [errors, setErrors] = useState({});
	const [disableSubmitButton, setDisableSubmitButton] = useState(true);
	const [countryCode, setCountryCode] = useState("+91");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	//Form input  handler to set state
	const handleInputChange = (e) => {
		const { value, name } = e?.target;
		if (name === "email") {
			setDataLogin({ ...dataLogin, [name]: value?.replace(/ /g, "") });
		} else if (name === "password") {
			setDataLogin({ ...dataLogin, [name]: value });
		}
		setErrors({});
	};

	useEffect(() => {
		if (radioValue === "1") {
			setDisableSubmitButton(
				!(dataLogin?.email?.length && dataLogin?.password?.length)
			);
		} else if (radioValue === "2") {
			setDisableSubmitButton(!dataLogin?.email?.length);
		}
	}, [dataLogin]);

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
					if (response?.status === 200) {
						if (radioValue === "2") {
							dispatch(setUser(payload));
							toast.success(response?.data?.message, {
								toastId: TextMsg.Login.successToastId,
							});
							navigate(routesPath.VERIFY, {
								state: {
									from: "login",
									contextInfo: { mobile: email, countryCode: countryCode },
								},
							});
						} else {
							toast.success(`login successfully`, {
								toastId: TextMsg.Login.successToastId,
							});
							// dispatching an action to set userData in store
							dispatch(setUser({ ...response?.data?.data }));
							// on successful login navigating to dashboard
							navigate(routesPath.DASHBOARD);
						}
					}
					setDisableSubmitButton(false);
				},
				(error) => {
					const {
						response: {
							data: { message , type},
						},
					} = error;
					setDisableSubmitButton(false);
					if(type === "EMAIL_NOT_VERIFIED"){
						navigate(routesPath.VERIFY, {
							state: {
							from: "login",
							contextInfo: { email : email, isEmail : (email)? true:false},	
						}}, )	
					}
					else{
						toast.error(message, {
							toastId: TextMsg.Login.errorToastId,
						});
					}
				}
			);
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
		setRadioValue(value);
		setCountryCode("+91");
	};

	return (
		<Container className="authForm login-wrapper">
			<h1>{TextMsg.Login.heading}</h1>
			<p>{TextMsg.Login.subHeading}</p>
			<Form className="form">
				<Row>
					<ButtonGroup className="mb-2 toggleBtn">
						{loginToggle.map((radio, idx) => (
							<ToggleButton
								key={idx}
								id={`radio-${idx}`}
								type={TextMsg.Login.typeToggleButton}
								variant="secondary"
								name={TextMsg.Login.nameToggleButton}
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
							<PhoneInput
								alwaysDefaultMask={false}
								className="phoneInput"
								country="in"
								enableSearch={true}
								onChange={inbuiltPhoneHandler}
								placeholder={TextMsg.Login.radioValuePhone}
								countryCodeEditable={false}
								onEnterKeyPress= {submitHandler} 
							/>
							{errors.email && (
								<Form.Text className="input-wrapper__errMsg">
									{errors.email}
								</Form.Text>
							)}
						</>
					) : (
						<>
							<InputGroup className="mb-2">
								<Form.Control
									type="text"
									placeholder={TextMsg.Login.radioValueEmail}
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
								type={
									showPassword
										? TextMsg.Login.radioValueText
										: TextMsg.Login.radioValuePassword
								}
								label={TextMsg.Login.password}
								name={TextMsg.Login.radioValuePassword}
								placeholder={TextMsg.Login.loginPassword}
								onChange={handleInputChange}
								value={dataLogin.password}
								error={errors.password}
								onlyCountries={["fr", "at"]}
							/>
							<img
								src={showPassword ? Images.showEye : Images.hideEye}
								className="login-wrapper__eyeImage"
								onClick={() => setShowPassword(!showPassword)}
								alt="eyeImage"
							/>
						</Row>
						<Row className="mt-2  forgot-password">
							<a
								onClick={() => navigate(routesPath.FORGOTPASSWORD)}
								href="javascript:void(0)"
								class="link-primary"
							>
								{TextMsg.ForgotPassword.forgotPassword}
							</a>
						</Row>
					</>
				)}
				<Row className="mt5">
					<ButtonComponent
						label={
							radioValue === "1" ? TextMsg.Login.login : TextMsg.Login.sendOtp
						}
						btnHandler={submitHandler}
						disabled={disableSubmitButton || Object.keys(errors).length}
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
				<SocialIcons />
			</Form>
		</Container>
	);
}
