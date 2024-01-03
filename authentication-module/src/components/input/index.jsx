import React from "react";
import {Form} from "react-bootstrap";
import "./index.css";

export default function InputComponent({
	type = "text",
	label,
	placeholder,
	error,
	value,
	onClick,
	onChange,
	disabled = false,
	name,
	className
}) {
	return (
		<Form.Group className="mb-4 input-wrapper">
			{label && <Form.Label className="d-flex">{label}</Form.Label>}
			<Form.Control
				type={type}
				placeholder={placeholder}
				aria-label={placeholder}
				name={name}
				onClick={onClick}
				onChange={onChange}
				value={value?.replace(/ /g, "")}
				disabled={disabled}
				className={className}
			/>
			{error && (
				<Form.Text className="input-wrapper__errMsg">{error}</Form.Text>
			)}
		</Form.Group>
	);
}
