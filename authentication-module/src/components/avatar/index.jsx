import { OverlayTrigger, Popover } from "react-bootstrap";
import Images from "../../utils/images";
import "./index.css";

const Avatar = ({ label, onClick }) => {
	const popover = (
		<Popover className="custom_popover" id="popover-basic">
			<Popover.Body>
				<div className="custom_popover__email">{label}</div>
			</Popover.Body>
			<Popover.Header
				className="custom_popover__header pointer-cursor"
				onClick={onClick}
			>
				Log Out
			</Popover.Header>
		</Popover>
	);

	return (
		<div className="avatar">
			<OverlayTrigger
				trigger="click"
				placement="bottom"
				overlay={popover}
				rootClose
			>
				<span className="avatar-icon pointer-cursor">
					<img src={Images.profileIcon} height="60px" width="60px" />
				</span>
			</OverlayTrigger>
		</div>
	);
};

export default Avatar;
