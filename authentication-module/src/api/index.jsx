import axios from "axios";
import urlinitialPart from "./env";;

const axiosInstance = axios.create({
	baseURL: `${urlinitialPart.baseUrl}`,
	timeout: 30000,
	headers: {
		deviceId: "abc@123",
		devicetype: 1,
		Authorization: `Basic ${btoa('rcc:rcc@123')}`,
	},
	
});


export default axiosInstance;