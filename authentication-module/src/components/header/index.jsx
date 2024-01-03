import Images from "../../utils/images";
import "./index.css";

export default function Header() {
	return (
		<div className="rccHeader">
			<div className="logo">
				<img src={Images.logo} alt="Logo" />
			</div>
		</div>
	);
}
