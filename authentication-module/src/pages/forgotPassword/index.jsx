import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import ButtonComponent from "../../components/button";
import { emailPattern } from "../../utils/common";
import TextMsg from "../../constants/textMessages";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {postApiCall} from "../../api/methods";
import endPoint from "../../api/endPoint";
import { routesPath } from "../../router/routes";
import InputComponent from "../../components/input";
import "./index.css";

function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [errors, setErrors] = React.useState({});
	const navigate = useNavigate();

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
			postApiCall(
				endPoint.forgotPassword,
				{ email },
				(response) => {
					if (response?.data.httpCode === 200) {
						toast.success(response.data.message, {
							toastId: "forgotPasswordSuccess",
						});
						navigate(routesPath.VERIFY, {state:{from:'forgotPassword',contextInfo:{email:email}}, replace : true});
					}
				},
				(error) => {
					const {
						response: {
							data: { message },
						},
					} = error;
					toast.error(message, {
						toastId: "forgotPasswordError"
					});
				}
			);
		}
	};

	const backButtonSubmitHandler =()=>{
		navigate(routesPath.LOGIN)
	}
	return (
		<Container className="login-wrapper mt-4">
			<Form>
				<Row className="forgotPassword-wrapper__label mb-4">
					{TextMsg.ForgotPassword.forgotYourPassword}
				</Row>
				<Row>
					<InputComponent
						type="text"
						label="Email"
						placeholder={TextMsg.ForgotPassword.email}
						name="email"
						onChange={(e)=>{setEmail(e.target.value);
						setErrors({})
						}}
						value={email}
						error={errors.email}
					/>
				</Row>
				<Row className="mt5">
					<ButtonComponent label="Send OTP" btnHandler={submitHandler} />
				</Row>
				<Row className="mt5">
					<ButtonComponent label="Back" btnHandler = {backButtonSubmitHandler}  />
				</Row>
			</Form>
		</Container>
	);
}

export default ForgotPassword;
