import React from "react";
import Images from "../../utils/images";
import "./index.css";

export default function SocialIcons() {
	return (
		<div className="mt-2">
			<ul class="foot_social_network">
			<li class="facebook">
					<a
						// href="https://www.facebook.com/Appinventiv/"
						target="_blank"
						rel="nofollow"
					>
						<img
							src={Images.facebook}
							alt="facebook"
							width="20px"
							height="20px"
						/>
					</a>
				</li>
				<li class="google">
					<a
						// href="https://www.instagram.com/appinventiv"
						target="_blank"
						rel="nofollow"
					>
						<img
							src={Images.googleIcon}
							alt="google"
							width="20px"
							height="20px"
						/>
					</a>
				</li>
				<li class="apple">
					<a
						// href="https://www.instagram.com/appinventiv"
						target="_blank"
						rel="nofollow"
					>
						<img
							src={Images.appleIcon}
							alt="apple"
							width="20px"
							height="20px"
						/>
					</a>
				</li>
				<li class="linkedin">
					<a
						// href="https://www.linkedin.com/company/appinventiv"
						target="_blank"
						rel="nofollow"
					>
						<img
							src={Images.linkedin}
							alt="linkedin"
							width="20px"
							height="20px"
						/>
					</a>
				</li>
			</ul>
		</div>
	);
}
