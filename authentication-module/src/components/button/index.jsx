import React from "react";
import Button from "react-bootstrap/Button";

export default function ButtonComponent({
	btnHandler,
	label,
	variant = "primary",
	classname,
	disable = false,
	size = "lg",
}) {
	return (
		<Button
			variant={variant}
			type="submit"
			onClick={btnHandler}
			className={classname}
			disable={disable}
			size={size}
		>
			{label}
		</Button>
	);
}
