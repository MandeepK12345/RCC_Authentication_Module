import React from "react";
import Button from "react-bootstrap/Button";
import './index.css'

export default function ButtonComponent({
	btnHandler,
	label,
	variant = "primary",
	classname,
	size = "lg",
}) {
	return (
		<Button
			variant={variant}
			type="submit"
			onClick={btnHandler}
			className={classname}
			size={size}
		>
			{label}
		</Button>
	);
}
