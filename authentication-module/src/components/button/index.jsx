import React from "react";
import Button from "react-bootstrap/Button";
import './index.css'

export default function ButtonComponent({
	btnHandler,
	label,
	variant = "primary",
	classname,
	size = "lg",
	disabled=false
}) {
	return (
		<Button
			variant={variant}
			type="submit"
			onClick={btnHandler}
			className={`btn-wrapper ${classname}`}
			size={size}
			disabled={disabled}
			tabIndex={0}
		>
			{label}
		</Button>
	);
}
