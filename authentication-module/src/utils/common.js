export const emailPattern = new RegExp(
	"^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9]+.)+[a-zA-Z]{2,}$"
);

export const passwordPattern = new RegExp(
	"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
);

export const numRegex = new RegExp(/^\d{10}$/);

export const phonePattern = new RegExp("^[0-9]+$");

export const enums={
	LOGIN:'login',
	FORGOTPASSWORD:'forgotPassword'
}
