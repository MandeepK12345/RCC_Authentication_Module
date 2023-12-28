import Api from "./index";

export const handleUnauthorisedUser = () => {
	//   localStorage.clear();
	//   store.dispatch(logout());
	//   // window.location.reload();
};

export const apiErrorCode = {
	unauthorized: 401,
	accessDenied: 430,
	sessionExpired: 440,
	validationError: 400,
	emailNotVerified: 403,
};

export const checkUserValidation = (statusCode) => {
	if (statusCode) {
		return (
			statusCode === apiErrorCode.sessionExpired ||
			statusCode === apiErrorCode.unauthorized ||
			statusCode === apiErrorCode.accessDenied
		);
	}
	return false;
};

/**
 * post api
 *
 * @param params
 * @param endPoint
 * @param errorCallback
 * @param successCallback
 */

const postApiCall = (endPoint, params, successCallback, errorCalback) => {
	Api.post(endPoint, params)
		.then((response) => {
			successCallback(response);
		})
		.catch((error) => {
			// if (error.message === 'Network Error') {
			//   // TODO: netword error
			// } else if (error.code === 'ECONNABORTED') {
			//   const payload = {
			//     data: {
			//       statusCode: 408,
			//     },
			//   }
			//   errorCalback(payload)
			// } else if (error.response) {
			//   if (checkUserValidation(error.response.status)) {
			//     handleUnauthorisedUser()
			//   }
			//   errorCalback(error.response)
			// } else if (!error.response) {
			//   const payload = {
			//     data: {
			//       statusCode: '',
			//     },
			//   }
			//   errorCalback(payload)
			// }
			console.log("error occured", error);
			errorCalback(error);
		});
};

/**
 * put api
 *
 * @param params
 * @param endPoint
 * @param errorCalback
 * @param successCallback
 */

const putApiCall = (endPoint, params, successCallback, errorCalback) => {
	Api.put(endPoint, params)
		.then((response) => {
			successCallback(response);
		})
		.catch((error) => {
			// if (error.message === 'Network Error') {
			//   // TODO: netword error
			// } else if (error.code === 'ECONNABORTED') {
			//   const payload = {
			//     data: {
			//       statusCode: 408,
			//     },
			//   }
			//   errorCalback(payload)
			// } else if (error.response) {
			//   if (checkUserValidation(error.response.status)) {
			//     handleUnauthorisedUser()
			//   }
			//   errorCalback(error.response)
			// } else if (!error.response) {
			//   const payload = {
			//     data: {
			//       statusCode: '',
			//     },
			//   }
			//   errorCalback(payload)
			// }
			console.log("error occured", error);
			errorCalback(error);
		});
};

export { putApiCall, postApiCall };
