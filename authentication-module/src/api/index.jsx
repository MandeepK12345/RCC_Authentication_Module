import axios from "axios";
// import store from "../store";
import urlinitialPart from "./env";
import TextMsg from "../constants/textMessages";

// need to remove hardcoed token
const createAxiosClient = function ({ options }) {
	const client = axios.create(options);

	// const state = store.getState();
	// console.log("const state = store.getState();", state.user);

	client.interceptors.request.use(
		(config) => {
			// get token value from store will update codes
			const token = null;
			if (token) {
				config.headers.Authorization = "Bearer " + token;
			} else {
				// config.headers.Authorization = `Basic ${btoa("rcc:rcc@123")}`;
				config.headers.Authorization =  TextMsg.ApiConfig.headerAuthorization;
			}

			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	return client;
};

const axiosInstance = createAxiosClient({
	options: {
		baseURL: `${urlinitialPart.baseUrl}`,
		timeout: 30000,
		headers: {	
			deviceId: "abc@123",
			devicetype: 1,
		},
	},
});

	// deviceId: TextMsg.ApiConfig.deviceId,
	// devicetype: TextMsg.ApiConfig.devicetype

export default axiosInstance;
