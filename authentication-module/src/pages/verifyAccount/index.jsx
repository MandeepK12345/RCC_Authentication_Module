import { Row, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import endPoint from "../../api/endPoint";
import ButtonComponent from "../../components/button";
import { postApiCall} from "../../api/methods";
import { routesPath } from "../../router/routes";
import TextMsg from "../../constants/textMessages";
import "./index.css";

const inputFields = ["otp1", "otp2", "otp3", "otp4"];

const otpData = {};

export default function VerifyAccount() {
	const navigate = useNavigate();
	const userInfo = useSelector((state) => state?.user);
	const location = useLocation();
	const forgotPasswordEmail = location?.state?.forgotPasswordEmail;

	const generatePayLoad=()=>{
		const { otp1, otp2, otp3, otp4 } = otpData;
		let code = undefined;
		if (otp1 && otp2 && otp3 && otp4) code = `${otp1}${otp2}${otp3}${otp4}`;

		const { email, countryCode, mobileNo } = userInfo||{};
		const phoneNo = mobileNo?.substr(countryCode?.length);

		let payload = {
			code: parseInt(code),
			email,
		};
		if (phoneNo) {
			payload = {
				countryCode,
				phoneNo: phoneNo,
				code: 4321 || parseInt(code), // for now hardcoded , will remove it
			};
		}

		return {payload, code }
	}

	const otpApi = (endPoint,payload,fromResendOtp)=>{
		postApiCall(
		 	endPoint,
			payload,
			(response) => {
				const {
					data: { statusCode, data, message },
				} = response;
				if (statusCode === 200) {
					toast.success(message);
					if(fromResendOtp) return;

					if(forgotPasswordEmail)
					navigate(routesPath.RESETPASSWORD,{state:{resetEmail:forgotPasswordEmail}});
					else
					navigate(routesPath.DASHBOARD);
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

	const validateOtp = () => {
		const {code,payload}= generatePayLoad();
		if (code) {
			const url=forgotPasswordEmail ? endPoint.validateForgotPassword : endPoint.verify;
			const apiPayLoad = forgotPasswordEmail
			? { email: forgotPasswordEmail, otp: parseInt(code) }
			: payload;
			otpApi(url,apiPayLoad)
		}
	};

	const handleOnChange = (e, name) => {
		if (e.target.value.length > 1) {
			e.target.value = e.target.value[0];
			return;
		}
		if (e.target.value) {
			moveFocusToNextInput(name);
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
		} else {
			inputFields.forEach((s) => {
				otpData[s] = document.getElementById(s)?.value;
			});
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

	const resendOtp = ()=>{
        otpApi(endPoint.resendOtp,{email:forgotPasswordEmail},true)
	}

	return (
		<Container className="alignCentre verifyAccount-wrapper">
			<h1>{TextMsg.VerifyAccount.verifyAccount}</h1>
			<p className="mt-15">
				{TextMsg.VerifyAccount.sentOTP}{" "}
				{forgotPasswordEmail ? (
					<span>email i.e {forgotPasswordEmail}</span>
				) : (
					<span>
						{userInfo?.mobileNo ? "mobile number" : "email"} i.e.{" "}
						{userInfo?.mobileNo}
						{userInfo?.email}
					</span>
				)}
			</p>

			<Row className="inputfieldContainer mt-15">
				{inputFields.map((item, index) => (
					<input
						id={item}
						key={index}
						className="otpInput"
						type="text"
						maxLength="1"
						onChange={(e) => {
							handleOnChange(e, item);
						}}
						onKeyDown={(e) => handleKeyDown(e, item)}
					/>
				))}
			</Row>

			<Row className="mt-15">
				<ButtonComponent label="VERIFY OTP" btnHandler={validateOtp} />
			</Row>
			<Row className="mt-2">
					 <a
						onClick={resendOtp}
						href="javascript:void(0)"
						class="link-primary"
					>
						{TextMsg.VerifyAccount.resendOTP}
					</a>
				</Row>
		</Container>
	);
}
