import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { toast } from "react-toastify";
import InputComponent from "../../components/input";
import ButtonComponent from "../../components/button";
import TextMsg from "../../constants/textMessages";
import { useLocation, useNavigate } from "react-router-dom";
import { putApiCall } from "../../api/methods";
import endPoint from "../../api/endPoint";
import { routesPath } from "../../router/routes";
import { passwordPattern } from "../../utils/common";
import Images from "../../utils/images";
import "./index.css";

function ResetPassword() {
	const [resetPasswordData, setResetPasswordData] = useState({});
	const [errors, setErrors] = useState({});
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [disableSubmitButton, setDisableSubmitButton] = useState(true);

	const navigate = useNavigate();
	const location = useLocation();

	const handleInputChange = (e) => {
		const { name, value } = e?.target;
		setResetPasswordData({ ...resetPasswordData, [name]: value });
		setErrors({});
	};

	useEffect(
		() =>
			setDisableSubmitButton(
				!(
					resetPasswordData?.password?.length &&
					resetPasswordData?.confirmPassword?.length
				)
			),
		[resetPasswordData]
	);

	const submitHandler = (event) => {
		event.preventDefault();
		const errors = {};
		const { password, confirmPassword } = resetPasswordData;
		const resetEmail = location?.state?.resetEmail;

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

		setErrors({ ...errors });
		if (!Object.keys(errors).length) {
			setDisableSubmitButton(true);

			const payloadGenerateOtp = {
				email: resetEmail,
				newPassword: password,
				confirmPassword: confirmPassword,
			};
			putApiCall(
				endPoint.resetPassword,
				payloadGenerateOtp,
				(response) => {
					if (response?.data.httpCode === 200) {
						toast.success(response.data.message, {
							toastId: "resetPasswordSuccess",
						});
						navigate(routesPath.LOGIN);
						setDisableSubmitButton(false);
					}
				},
				(error) => {
					const {
						response: {
							data: { message },
						},
					} = error;
					setDisableSubmitButton(false);
					// toast.error(message, {
					// 	toastId: "resetError",
					// });
				}
			);
		}
	};

	return (
		<Container className="authForm login-wrapper">
			<Form className="form">
				<h1>Reset Password</h1>
				<p>Enter a new password to reset the password on your account.</p>
				<Row className="login-wrapper__passwordField">
					<InputComponent
						type={showPassword ? "text" : "password"}
						label="New Password"
						name="password"
						placeholder={TextMsg.SignUp.newPassword}
						onChange={handleInputChange}
						value={resetPasswordData.password}
						error={errors.password}
					/>
					<img
						src={showPassword ? Images.showEye : Images.hideEye}
						className="login-wrapper__eyeImage"
						onClick={() => setShowPassword(!showPassword)}
						alt="eyeImage"
					/>
				</Row>
				<Row className="login-wrapper__passwordField">
					<InputComponent
						type={showConfirmPassword ? "text" : "password"}
						label="Confirm Password"
						name="confirmPassword"
						placeholder={TextMsg.SignUp.confirmPassword}
						onChange={handleInputChange}
						value={resetPasswordData.confirmPassword}
						error={errors.confirmPassword}
						onKeyDown ={submitHandler}  //handled submit press from keyboard 	
					/>
					<img
						src={showConfirmPassword ? Images.showEye : Images.hideEye}
						className="login-wrapper__eyeImage"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						alt="eyeImage"
					/>
				</Row>

				<Row className="mt5">
					<ButtonComponent
						label="Submit"
						btnHandler={submitHandler}
						disabled={disableSubmitButton}
					/>
					<ButtonComponent
						label="Back"
						classname="mt-4"
						btnHandler={() => {
							navigate(routesPath.LOGIN);
						}}
					/>
				</Row>
			</Form>
		</Container>
	);
}

export default ResetPassword;
