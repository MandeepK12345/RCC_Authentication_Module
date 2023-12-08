import axios, { AxiosInstance } from "axios";
import urlinitialPart from "./env";
import urlSecondHalf from "./urlSecondHalf";

const axiosInstance = axios.create({
	baseURL: `${urlinitialPart.baseUrl}${urlSecondHalf.userLogin}`,
	timeout: 30000,
	headers: {
		deviceId: "abc@123",
		devicetype: 1,
	},
});


export default axiosInstance;