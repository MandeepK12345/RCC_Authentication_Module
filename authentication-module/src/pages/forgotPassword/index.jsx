import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import ButtonComponent from "../../components/button";
import { emailPattern } from "../../utils/common";
import TextMsg from "../../constants/textMessages";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { postApiCall } from "../../api/methods";
import endPoint from "../../api/endPoint";
import { routesPath } from "../../router/routes";
import InputComponent from "../../components/input";
import "./index.css";

function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [errors, setErrors] = useState({});
	const [disableSubmitButton, setDisableSubmitButton] = useState(true);
	const navigate = useNavigate();

	useEffect(() => setDisableSubmitButton(!email.length), [email]);

	const submitHandler = (event) => {
		event.preventDefault();
		const errors = {};
		if (!email) {
			errors.email = TextMsg.ForgotPassword.emailRequired;
		} else if (!email.match(emailPattern)) {
			errors.email = TextMsg.ForgotPassword.validEmail;
		}
		setErrors({ ...errors });
		if (!Object.keys(errors).length) {
			setDisableSubmitButton(true);
			postApiCall(
				endPoint.forgotPassword,
				{ email },
				(response) => {
					if (response?.data.httpCode === 200) {
						toast.success(response.data.message, {
							toastId: "forgotPasswordSuccess",
						});
						navigate(routesPath.VERIFY, {
							state: { from: "forgotPassword", contextInfo: { email: email } },
							replace: true,
						});
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
						toastId: "forgotPasswordError",
					});
				}
			);
		}
	};

	const backButtonSubmitHandler = () => {
		navigate(routesPath.LOGIN);
	};
	return (
		<Container className="authForm login-wrapper">
			<h1>{TextMsg.ForgotPassword.forgotYourPassword}</h1>
			<Form className="form">
				<Row className="forgotPassword-wrapper__label mb-4"></Row>
				<Row>
					<InputComponent
						type="text"
						label="Email"
						placeholder={TextMsg.ForgotPassword.email}
						name="email"
						onChange={(e) => {
							setEmail(e.target.value?.replace(/ /g, ""));
							setErrors({});
						}}
						value={email}
						error={errors.email}
					/>
				</Row>
				<Row className="mt5">
					<ButtonComponent
						label="Send OTP"
						btnHandler={submitHandler}
						disabled={disableSubmitButton}
					/>
				</Row>
				<Row className="mt5">
					<ButtonComponent label="Back" btnHandler={backButtonSubmitHandler} />
				</Row>
			</Form>
		</Container>
	);
}

export default ForgotPassword;
