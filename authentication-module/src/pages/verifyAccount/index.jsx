import React, { useEffect, useState } from "react";
import { Row, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import endPoint from "../../api/endPoint";
import ButtonComponent from "../../components/button";
import { postApiCall } from "../../api/methods";
import { setUser } from "../../state";
import { routesPath } from "../../router/routes";
import TextMsg from "../../constants/textMessages";
import {
	phonePattern,
} from "../../utils/common";
import "./index.css";

const inputFields = ["otp1", "otp2", "otp3", "otp4"];

const otpData = {};

export default function VerifyAccount() {
	const [timer, setTimer] = useState(30);
	const navigate = useNavigate();
	const userInfo = useSelector((state) => state?.user);
	const location = useLocation();
	const dispatch = useDispatch();
	const [disableOtp, setDisableOtp] = useState(true);
	const { from, contextInfo, isEmail } = location?.state || {};
	const fromForgotPaswordScreen = from === "forgotPassword";
	const fromLoginScreen = from === "login";
	const { email, countryCode, mobileNo } = userInfo || {};
	const phoneNo = mobileNo?.substr(countryCode?.length);

	useEffect(() => {
		if (!userInfo && from !== "forgotPassword") {
			navigate(routesPath.LOGIN);
		} 
	}, []);

	React.useEffect(() => {
		const TimerInt =
			timer > 0 &&
			setInterval(() => {
				setTimer((time) => time - 1);
			}, 1000);
		return () => {
			clearInterval(TimerInt);
		};
	}, [timer]);

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
			.toString()
			.padStart(2, "0")}`;
	};

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === "Enter") {
				validateOtp();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const generatePayLoad = () => {
		const { otp1, otp2, otp3, otp4 } = otpData;
		let code = undefined;
		if (otp1 && otp2 && otp3 && otp4) code = `${otp1}${otp2}${otp3}${otp4}`;

		let payload = {
			code: parseInt(code),
			email,
		};

		if (from === "login") {
			if (contextInfo.isEmail) {
				payload = {
					email: contextInfo.email,
					code: 4321 || parseInt(code), // for now hardcoded , will remove it
				};
			} else {
				payload = {
					countryCode: contextInfo.countryCode,
					phoneNo: contextInfo.mobile,
					code: 4321 || parseInt(code), // for now hardcoded , will remove it
				};
			}
		} else if (phoneNo) {
			payload = {
				countryCode,
				phoneNo: phoneNo,
				code: 4321 || parseInt(code), // for now hardcoded , will remove it
			};
		}
		return { payload, code };
	};
	const otpApi = (endPoint, payload, fromResendOtp) => {
		postApiCall(
			endPoint,
			payload,
			(response) => {
				const {
					data: { statusCode, message, data },
				} = response;
				if (statusCode === 200 || statusCode === 201) {
					toast.success(message, {
						toastId: "verifyAccountSuccess",
					});
					// toast.success("Sign-up Successfully");
					if (fromResendOtp) return;
					if (from === "login") {
						dispatch(setUser({ ...data }));
					}

					if (fromForgotPaswordScreen)
						navigate(routesPath.RESETPASSWORD, {
							state: { resetEmail: contextInfo.email },
						});
					else navigate(routesPath.DASHBOARD);
				}
			},
			(error) => {
				const {
					response: {
						data: { message },
					},
				} = error;
				toast.error(message, {
					toastId: "verifyAccountError",
				});
			}
		);
	};

	const getUrl = () => {
		switch (from) {
			case "login": {
				if (contextInfo.isEmail) {
					return endPoint.verifySignupOtp;
				} else {
					return endPoint.verifyLoginOtp;
				}
			}
			case "forgotPassword": {
				return endPoint.validateForgotPassword;
			}
			default: {
				return endPoint.verifySignupOtp;
			}
		}
	};

	const validateOtp = () => {
		const { code, payload } = generatePayLoad();
		if (code) {
			const apiPayLoad = fromForgotPaswordScreen
				? { email: contextInfo.email, otp: parseInt(code) }
				: payload;
			otpApi(getUrl(), apiPayLoad);
		}
	};

	const resendOtpLoginSignup = () => {
		const url = endPoint.getOtp;
		const { countryCode } = userInfo || {};
		let apiPayLoad = fromLoginScreen
			? {
					countryCode: contextInfo.countryCode,
					phoneNo: contextInfo.mobile,
			  }
			: isEmail
			? {
					email: email,
			  }
			: {
					countryCode: countryCode,
					phoneNo: phoneNo,
			  };
		postApiCall(
			url,
			apiPayLoad,
			(response) => {
				if (response?.data?.httpCode === 200) {
					toast.success(response.data.message, {
						toastId: "resendOtpSuccess",
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
					toastId: "resendOtpError",
				});
			}
		);
	};

	const handleOnChange = (e, name) => {
		if (e.target.value.length > 1) {
			e.target.value = e.target.value[0];
			return;
		}
		if (e.target.value?.match(phonePattern)) {
			moveFocusToNextInput(name);
		}else{
			e.target.value=null;
		}
		if (!e.target.value) {
			setDisableOtp(true);
		}
	};
	// Function to move focus to the next input field
	const moveFocusToNextInput = (currentField) => {
		const currentIndex = inputFields.indexOf(currentField);
		if (currentIndex < inputFields.length - 1) {
			const nextField = inputFields[currentIndex + 1];
			const nextValue = document.getElementById(nextField)?.value;
			if (nextValue) {
				delete otpData[nextField];
			}
			const nextFieldRef = document.getElementById(nextField);
			if (nextFieldRef) {
				nextFieldRef.focus();
			}
			setDisableOtp(true);
		} else {
			inputFields.forEach((s) => {
				otpData[s] = document.getElementById(s)?.value;
			});
			setDisableOtp(false);
		}
	};

	const handleKeyDown = (e, field) => {
		if (e.key === "Backspace" && field !== "otp1") {
			const index = inputFields.indexOf(field);
			const currentEle = document.getElementById(inputFields[index]);
			if (currentEle) {
				currentEle.value = "";
				delete otpData[inputFields[index]];
			}
			document.getElementById(inputFields[index - 1])?.focus();
		}
	};

	const resendOtp = () => {
		setTimer(30);
		if (fromForgotPaswordScreen) {
			otpApi(endPoint.resendOtp, { email: contextInfo.email }, true);
		} else {
			resendOtpLoginSignup();
		}
	};

	const getMessages = () => {
		let result = null;
		switch (from) {
			case "login": {
				if (contextInfo.isEmail) {
					result = <span>{contextInfo.email}</span>;
					break;
				} else {
					result = <span>{contextInfo.countryCode + contextInfo.mobile}</span>;
					break;
				}
			}
			case "forgotPassword": {
				result = <span>{contextInfo.email} to reset your password.</span>;
				break;
			}
			default: {
				result = (
					<span>
						{userInfo?.mobileNo}
						{userInfo?.email}
					</span>
				);
				break;
			}
		}
		return result;
	};

	return (
		<Container className="authForm alignCentre verifyAccount-wrapper">
			<h1>{TextMsg.VerifyAccount.verifyAccount}</h1>
			<p className="mt-15">
				{TextMsg.VerifyAccount.sentOTP}&nbsp;
				{getMessages()}
			</p>

			<Row className="inputfieldContainer mt-15">
				{inputFields.map((item, index) => (
					<input
						id={item}
						tabIndex={0}
						key={index}
						className="otpInput"
						type="text"
						maxLength="1"
						onChange={(e) => {
							handleOnChange(e, item);
						}}
						onKeyDown={(e) => handleKeyDown(e, item)}
						onEnterKeyPress={validateOtp}
					/>
				))}
			</Row>

			<ButtonComponent
				label="Verify OTP"
				btnHandler={validateOtp}
				classname="mt-4"
				disabled={disableOtp}
			/>
			{fromForgotPaswordScreen || fromLoginScreen ? (
				<ButtonComponent
					label="Back"
					btnHandler={() => {
						navigate(routesPath.LOGIN);
					}}
					classname="mt-4"
				/>
			) : (
				<ButtonComponent
					label="Back"
					btnHandler={() => {
						navigate(routesPath.SIGNUP);
					}}
					classname="mt-4"
				/>
			)}

			<Row className="mt-2">
				<span>Didn’t receive the code? </span>
				<a
					onClick={resendOtp }
					href="javascript:void(0)"
					class={`link-primary ${timer>0?'resend-otp-disable':''}`}
				>
					{TextMsg.VerifyAccount.resendOTP}
				</a>
				<p className="link">{formatTime(timer)}</p>
			</Row>
		</Container>
	);
}
