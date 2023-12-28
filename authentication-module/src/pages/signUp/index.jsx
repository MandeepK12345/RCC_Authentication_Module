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
	{ name: "SignUp with email", value: "1" },
	{ name: "SignUp with phone", value: "2" },
];

export default function Signup() {
	const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
	const [dataLogin, setDataLogin] = React.useState({
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [radioValue, setRadioValue] = useState("1");
	const [errors, setErrors] = React.useState({});
	const [disableSubmitButton, setDisableSubmitButton] = React.useState(false);
	const [showPhoneField, setShowPhoneField] = React.useState(false);
	const [phoneDropDown, setPhoneDropDown] = React.useState("");
	const [countryCode, setCountryCode] = useState("+91");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleInputChange = (e) => {
		const { value, name } = e?.target;
		setDataLogin({ ...dataLogin, [name]: value });
		setErrors({});
	};

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
			errors.confirmPassword = "confirm password should be same";
		}
		setErrors({ ...errors });
		if (!Object.keys(errors).length) {
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
						toast.success(message);
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
									toast.success(response.data.message);
									navigate(routesPath.VERIFY);
								}
							},
							(error) => {
								const {
									response: {
										data: { message },
									},
								} = error;
								toast.error(message);
							}
						);
					}
				},
				(error) => {
					const {
						response: {
							data: { message },
						},
					} = error;
					toast.error(message);
				}
			);
		}
	};

	useEffect(() => {
		if (!Object.keys(errors).length) {
			setDisableSubmitButton(true);
		}
	}, [errors]);

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
		<Container className="login-wrapper mt-4">
			<Form>
				<Row className="login-wrapper__label mb-4">Register Form</Row>
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
							<InputGroup className="mb-4">
								{radioValue === "2" && (
									<InputGroup.Text
										id="basic-addon1"
										onClick={showPhoneFieldHandler}
									>
										+91
									</InputGroup.Text>
								)}
								<Form.Control
									type="text"
									placeholder={
										radioValue === "1" ? "Enter your Email" : "Enter your Phone"
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
				<Row className="login-wrapper__passwordField">
					<InputComponent
						type="password"
						label="Create Password"
						name="password"
						placeholder="Enter your new Password"
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
						placeholder="Confirm your new Password"
						onChange={handleInputChange}
						value={dataLogin.confirmPassword}
						error={errors.confirmPassword}
					/>
					<img
						src={Images.VisibilityIcon}
						className="login-wrapper__eyeImage"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						alt="eyeImage"
					/>
				</Row>

				<Row className="mt5">
					<ButtonComponent
						label="Signup"
						btnHandler={submitHandler}
						disable={disableSubmitButton}
					/>
				</Row>
			</Form>
		</Container>
	);
}
